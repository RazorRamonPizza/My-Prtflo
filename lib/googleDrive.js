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

    // 1. Находим все ПАПКИ в главной папке
    const categoryFoldersRes = await drive.files.list({
      q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
    });

    if (!categoryFoldersRes.data.files || categoryFoldersRes.data.files.length === 0) {
      console.warn("Could not find any category folders. Check permissions and that the main folder contains sub-folders.");
      return { categories: [], works: [] };
    }

    const categories = categoryFoldersRes.data.files;
    let allWorks = [];

    // 2. Для каждой папки-категории получаем ее содержимое (видео и картинки)
    for (const category of categories) {
      const worksRes = await drive.files.list({
        q: `'${category.id}' in parents and trashed=false and (mimeType contains 'image/' or mimeType contains 'video/')`,
        fields: 'files(id, name, mimeType, thumbnailLink, webContentLink)',
      });

      if (worksRes.data.files && worksRes.data.files.length > 0) {
        const works = worksRes.data.files.map(file => {
          const isVideo = file.mimeType.includes('video');
          return {
            id: file.id,
            title: file.name.split('.').slice(0, -1).join('.'),
            category: category.name,
            type: isVideo ? 'video' : 'image',
            url: isVideo ? `https://drive.google.com/uc?id=${file.id}` : (file.thumbnailLink ? file.thumbnailLink.replace(/=s\d+/, '=s1920') : null),
            thumbnail: file.thumbnailLink ? file.thumbnailLink.replace(/=s\d+/, '=s400') : null,
          };
        });
        allWorks = [...allWorks, ...works];
      }
    }

    return {
      categories: categories.map(c => c.name).sort((a, b) => a.localeCompare(b)),
      works: allWorks.sort((a, b) => a.title.localeCompare(b.title)),
    };
  } catch (error) {
    console.error('Error fetching from Google Drive:', error.message);
    return { categories: [], works: [] };
  }
}