<?php
if(!defined('SIGN_IN_ELEMENT_MAPPING_FIELD_NAME')){define('SIGN_IN_ELEMENT_MAPPING_FIELD_NAME','employee');}

if(!defined('APP_NAME')){define('APP_NAME','PCP Hrm');}
if(!defined('FB_URL')){define('FB_URL', 'https://www.facebook.com/');};
if(!defined('TWITTER_URL')){define('TWITTER_URL', 'https://twitter.com/');};

define('HOME_LINK_ADMIN', CLIENT_BASE_URL."?g=admin&n=dashboard&m=admin_Admin");
define('HOME_LINK_OTHERS', CLIENT_BASE_URL."?g=modules&n=dashboard&m=module_Personal_Information");

//Version
define('VERSION', '13.3.PRO');
define('CACHE_VALUE', '13.3.PRO');
define('VERSION_DATE', '11/11/2015');

if(!defined('CONTACT_EMAIL')){define('CONTACT_EMAIL','hr@pcp-eg.com');}
if(!defined('KEY_PREFIX')){define('KEY_PREFIX','IceHrm');}
if(!defined('APP_SEC')){define('APP_SEC','dbcs234d2saaqw');}

define('UI_SHOW_SWITCH_PROFILE', true);
define('CRON_LOG', '/var/log/nginx/icehrmcron.log');
