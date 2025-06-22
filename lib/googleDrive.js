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

    // ЗАПРАШИВАЕМ АБСОЛЮТНО ВСЕ ЭЛЕМЕНТЫ ВНУТРИ ГЛАВНОЙ ПАПКИ
    const diagnosticRes = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, mimeType, shortcutDetails)', // Запрашиваем все возможные детали
    });

    // Выводим в лог всё, что нашли
    console.log("FINAL DIAGNOSTIC - ALL ITEMS:", JSON.stringify(diagnosticRes.data.files, null, 2));

    // Возвращаем пустые данные, так как это только тест
    return { categories: [], works: [] };

  } catch (error) {
    console.error('FINAL DIAGNOSTIC - ERROR:', error.message);
    return { categories: [], works: [] };
  }
}