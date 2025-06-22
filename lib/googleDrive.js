import { google } from 'googleapis';

export async function getPortfolioData() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth });
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    // 1. Находим все ЯРЛЫКИ в главной папке
    const shortcutRes = await drive.files.list({
      q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.shortcut' and trashed=false`,
      fields: 'files(id, name, shortcutDetails)',
    });

    if (!shortcutRes.data.files || shortcutRes.data.files.length === 0) {
      console.warn("Could not find any shortcuts in the root folder.");
      return { categories: [], works: [] };
    }

    const shortcuts = shortcutRes.data.files;
    let allWorks = [];
    const categories = [];

    // 2. Для каждого ярлыка находим настоящую папку и ее содержимое
    for (const shortcut of shortcuts) {
      // Добавляем имя ярлыка в список категорий
      categories.push(shortcut.name);
      
      // Получаем ID папки, на которую указывает ярлык
      const targetFolderId = shortcut.shortcutDetails.targetId;

      const worksRes = await drive.files.list({
        q: `'${targetFolderId}' in parents and trashed=false and (mimeType contains 'image/' or mimeType contains 'video/')`,
        fields: 'files(id, name, mimeType, thumbnailLink, webContentLink)',
      });

      if (worksRes.data.files && worksRes.data.files.length > 0) {
        const works = worksRes.data.files.map(file => {
          const isVideo = file.mimeType.includes('video');
          return {
            id: file.id,
            title: file.name.split('.').slice(0, -1).join('.'),
            category: shortcut.name, // Используем имя ярлыка как категорию
            type: isVideo ? 'video' : 'image',
            url: isVideo ? `https://drive.google.com/uc?id=${file.id}` : (file.thumbnailLink ? file.thumbnailLink.replace(/=s\d+/, '=s1920') : null),
            thumbnail: file.thumbnailLink ? file.thumbnailLink.replace(/=s\d+/, '=s400') : null,
          };
        });
        allWorks = [...allWorks, ...works];
      }
    }

    return {
      categories: categories.sort((a, b) => a.localeCompare(b)),
      works: allWorks.sort((a, b) => a.title.localeCompare(b.title)),
    };
  } catch (error) {
    console.error('Error fetching from Google Drive:', error.message);
    return { categories: [], works: [] };
  }
}