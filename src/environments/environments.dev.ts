// Database conf
// Passport conf

export class DBConfig
{
    public static DB_HOST: string = process.env.DB_HOST || "localhost";
    public static DB_PORT: string = process.env.DB_PORT || "27017";
    public static DB_NAME: string = process.env.DB_NAME || "process-system";
    public static DB_USER: string = process.env.DB_USER || null;
    public static DB_PW: string = process.env.DB_PW || null;
}
