import { configDotenv } from 'dotenv';
import { createClient } from 'webdav';
configDotenv();

export const client = createClient(
    'https://webdav.yandex.ru/', 
    {
        username: process.env.WD_USERNAME, 
        password: process.env.WD_PASSWORD
    }
);