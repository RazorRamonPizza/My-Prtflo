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

    const categoryFoldersRes = await drive.files.list({
      q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
    });

    if (!categoryFoldersRes.data.files) {
      throw new Error("Could not find category folders. Check permissions and folder ID.");
    }

    const categories = categoryFoldersRes.data.files;
    let allWorks = [];

    for (const category of categories) {
      const worksRes = await drive.files.list({
        q: `'${category.id}' in parents and trashed=false`,
        fields: 'files(id, name, webViewLink, thumbnailLink)',
      });

      if (worksRes.data.files) {
        const works = worksRes.data.files.map(file => ({
          id: file.id,
          title: file.name.split('.').slice(0, -1).join('.'),
          category: category.name,
          url: `https://lh3.googleusercontent.com/d/${file.id}=w1000`, // Более надежная ссылка
        }));
        allWorks = [...allWorks, ...works];
      }
    }

    return {
      categories: categories.map(c => c.name),
      works: allWorks.sort((a, b) => a.title.localeCompare(b.title)),
    };
  } catch (error) {
    console.error('Error fetching from Google Drive:', error);
    return { categories: [], works: [] };
  }
}