/**
 * This interface is used to represent the Admin entity that is saved in the database 
 */
export interface Admin {
    admin_id:       number; // the id of the admin
    username:       string; // the username of the admin
    password:       string; // the password of the admin
    refresh_token?: string; // the refresh token for the admin
}