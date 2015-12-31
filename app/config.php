<?php 
ini_set('error_log', 'data/icehrm.log');

define('CLIENT_NAME', 'app');
define('APP_BASE_PATH', 'C:\xamppe\htdocs\ICEPRO\\');
define('CLIENT_BASE_PATH', 'C:\xamppe\htdocs\ICEPRO\app\\');
define('BASE_URL','http://localhost/icepro/');
define('CLIENT_BASE_URL','http://localhost/icepro/app/');

define('APP_DB', 'icehrmdb');
define('APP_USERNAME', 'root');
define('APP_PASSWORD', '');
define('APP_HOST', 'localhost');
define('APP_CON_STR', 'mysql://'.APP_USERNAME.':'.APP_PASSWORD.'@'.APP_HOST.'/'.APP_DB);

//file upload
define('FILE_TYPES', 'jpg,png,jpeg');
define('MAX_FILE_SIZE_KB', 10 * 1024);
