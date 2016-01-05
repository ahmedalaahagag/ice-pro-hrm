<?php
define('CLIENT_PATH',dirname(__FILE__));
include ("config.base.php");
include ("include.common.php");
include("server.includes.inc.php");
if(empty($user)){
    if(!empty($_REQUEST['username']) && !empty($_REQUEST['password'])){
        $suser = null;
        $ssoUserLoaded = false;

        if(empty($suser)){
            $suser = new User();
            $suser->Load("(username = ? or email = ?) and password = ?",array($_REQUEST['username'],$_REQUEST['username'],md5($_REQUEST['password'])));
        }

        if($suser->password == md5($_REQUEST['password']) || $ssoUserLoaded){
            $user = $suser;
            SessionUtils::saveSessionObject('user', $user);
            $suser->last_login = date("Y-m-d H:i:s");
            $suser->Save();

            if(!$ssoUserLoaded && !empty(BaseService::getInstance()->auditManager)){
                BaseService::getInstance()->auditManager->user = $user;
                BaseService::getInstance()->audit(IceConstants::AUDIT_AUTHENTICATION, "User Login");
            }

            $redirectUrl = SessionUtils::getSessionObject('loginRedirect');
            if(!empty($redirectUrl)){
                header("Location:".$redirectUrl);
            }else{
                if($user->user_level == "Admin"){
                    header("Location:".HOME_LINK_ADMIN);
                }else{
                    if(empty($user->default_module)){
                        header("Location:".HOME_LINK_OTHERS);
                    }else{
                        $defaultModule = new Module();
                        $defaultModule->Load("id = ?",array($user->default_module));
                        $homeLink = CLIENT_BASE_URL."?g=".$defaultModule->mod_group."&&n=".$defaultModule->name.
                            "&m=".$defaultModule->mod_group."_".str_replace(" ","_",$defaultModule->menu);
                        header("Location:".$homeLink);
                    }
                }
            }

        }else{
            header("Location:".CLIENT_BASE_URL."login.php?f=1");
        }
    }
}else{
    if($user->user_level == "Admin"){
        header("Location:".HOME_LINK_ADMIN);
    }else{
        if(empty($user->default_module)){
            header("Location:".HOME_LINK_OTHERS);
        }else{
            $defaultModule = new Module();
            $defaultModule->Load("id = ?",array($user->default_module));
            $homeLink = CLIENT_BASE_URL."?g=".$defaultModule->mod_group."&&n=".$defaultModule->name.
                "&m=".$defaultModule->mod_group."_".str_replace(" ","_",$defaultModule->menu);
            header("Location:".$homeLink);
        }
    }

}

$tuser = SessionUtils::getSessionObject('user');
//check user

/*
$logoFileName = CLIENT_BASE_PATH."data/logo.png";
$logoFileUrl = CLIENT_BASE_URL."data/logo.png";
if(!file_exists($logoFileName)){
$logoFileUrl = BASE_URL."images/logo.png";
}*/
$logoFileUrl = UIManager::getInstance()->getCompanyLogoUrl();
?>
<!DOCTYPE html>
<!-- 
Template Name: Metronic - Responsive Admin Dashboard Template build with Twitter Bootstrap 3.3.5
Version: 4.1.0
Author: KeenThemes
Website: http://www.keenthemes.com/
Contact: support@keenthemes.com
Follow: www.twitter.com/keenthemes
Like: www.facebook.com/keenthemes
Purchase: http://themeforest.net/item/metronic-responsive-admin-dashboard-template/4021469?ref=keenthemes
License: You must have a valid license purchased only from themeforest(the above link) in order to legally use the theme for your project.
-->
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!-->
<html lang="en">
<!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
<meta charset="utf-8"/>
<title>PCP Intranet | Login Form </title>
<link rel="icon" href="<?=BASE_URL?>/img/pcp-title-logo-01.png" type="image/x-icon">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<meta http-equiv="Content-type" content="text/html; charset=utf-8">
<meta content="" name="description"/>
<meta content="" name="author"/>
<!-- BEGIN GLOBAL MANDATORY STYLES -->
<link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css"/>
<link href="<?=BASE_URL?>assets/global/css/components.css" rel="stylesheet" type="text/css"/>
<link href="<?=BASE_URL?>assets/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>
<link href="<?=BASE_URL?>assets/global/plugins/simple-line-icons/simple-line-icons.min.css" rel="stylesheet" type="text/css"/>
<link href="<?=BASE_URL?>assets/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
<link href="<?=BASE_URL?>assets/global/plugins/uniform/css/uniform.default.min.css"rel="stylesheet" type="text/css"/>
<!-- END GLOBAL MANDATORY STYLES -->
<!-- BEGIN PAGE LEVEL STYLES -->
<link href="<?=BASE_URL?>assets/global/plugins/select2/select2.css" rel="stylesheet" type="text/css"/>
<link href="<?=BASE_URL?>assets/admin/pages/css/login-soft.css" rel="stylesheet" type="text/css"/>
<!-- END PAGE LEVEL SCRIPTS -->
<!-- BEGIN THEME STYLES -->
<link href="<?=BASE_URL?>assets/global/css/components.css" id="style_components" rel="stylesheet" type="text/css"/>
<link href="<?=BASE_URL?>assets/global/css/plugins.css" rel="stylesheet" type="text/css"/>
<link href="<?=BASE_URL?>assets/admin/layout/css/layout.css" rel="stylesheet" type="text/css"/>
<link id="style_color" href="<?=BASE_URL?>/assets/admin/layout/css/themes/darkblue.css" rel="stylesheet" type="text/css"/>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.js"></script>
<script src="<?=BASE_URL?>bootstrap/js/bootstrap.js"></script>
<script src="<?=BASE_URL?>js/jquery.placeholder.js"></script>
<script src="<?=BASE_URL?>js/jquery.dataTables.js"></script>
<script src="<?=BASE_URL?>js/bootstrap-datepicker.js"></script>
<link href="<?=BASE_URL?>bootstrap/css/bootstrap-responsive.css" rel="stylesheet">
<link href="<?=BASE_URL?>css/DT_bootstrap.css?v=0.4" rel="stylesheet">
<link href="<?=BASE_URL?>css/datepicker.css" rel="stylesheet">
<link href="<?=BASE_URL?>css/style.css?v=<?=$cssVersion?>" rel="stylesheet">

<!-- END THEME STYLES -->
<link rel="shortcut icon" href="favicon.ico"/>

<link rel="stylesheet" href="<?=BASE_URL?>/css/pcp.css">

</head>
<!-- END HEAD -->
<!-- BEGIN BODY -->
<body class="login">
<!-- BEGIN LOGO -->
<div class="logo">
	<a href="index.html">
	<img src="<?=BASE_URL?>/img/pcp_logo-01.png" width="200" style="margin-top: -55px;">
	</a>
</div>
<!-- END LOGO -->
<!-- BEGIN SIDEBAR TOGGLER BUTTON -->
<script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', '<?=BaseService::getInstance()->getGAKey()?>', 'gamonoid.com');
    ga('send', 'pageview');

</script>

<script type="text/javascript">
    var key = "";
    <?php if(isset($_REQUEST['key'])){?>
    key = '<?=$_REQUEST['key']?>';
    key = key.replace(/ /g,"+");
    <?php }?>

    $(document).ready(function() {
        $(window).keydown(function(event){
            if(event.keyCode == 13) {
                event.preventDefault();
                return false;
            }
        });

        $("#password").keydown(function(event){
            if(event.keyCode == 13) {
                submitLogin();
                return false;
            }
        });
    });

    function showForgotPassword(){
        $("#loginForm").hide();
        $("#requestPasswordChangeForm").show();
    }

    function requestPasswordChange(){
        $("#requestPasswordChangeFormAlert").hide();
        var id = $("#usernameChange").val();
        $.post("service.php", {'a':'rpc','id':id}, function(data) {
            if(data.status == "SUCCESS"){
                $("#requestPasswordChangeFormAlert").show();
                $("#requestPasswordChangeFormAlert").html(data.message);
            }else{
                $("#requestPasswordChangeFormAlert").show();
                $("#requestPasswordChangeFormAlert").html(data.message);
            }
        },"json");
    }

    function changePassword(){
        $("#newPasswordFormAlert").hide();
        var password = $("#password").val();

        var passwordValidation =  function (str) {
            var val = /^[a-zA-Z0-9]\w{6,}$/;
            return str != null && val.test(str);
        };


        if(!passwordValidation(password)){
            $("#newPasswordFormAlert").show();
            $("#newPasswordFormAlert").html("Password may contain only letters, numbers and should be longer than 6 characters");
            return;
        }


        $.post("service.php", {'a':'rsp','key':key,'pwd':password,"now":"1"}, function(data) {
            if(data.status == "SUCCESS"){
                top.location.href = "login.php?c=1";
            }else{
                $("#newPasswordFormAlert").show();
                $("#newPasswordFormAlert").html(data.message);
            }
        },"json");
    }

    function submitLogin(){
        $("#loginForm").submit();
    }

</script>
<!-- END SIDEBAR TOGGLER BUTTON -->
<!-- BEGIN LOGIN -->
<div class="content">
	<!-- BEGIN LOGIN FORM -->
    <?php if(!isset($_REQUEST['cp'])){?>
	<form class="login-form" action="login.php" method="post">
		<h3 class="form-title">Login to your account</h3>
		<div class="alert alert-danger display-hide">
			<button class="close" data-close="alert"></button>
			<span>
			Enter any username and password. </span>
		</div>
		<div class="form-group">
			<!--ie8, ie9 does not support html5 placeholder, so we just show field title for that-->
			<label class="control-label visible-ie8 visible-ie9">Username</label>
			<div class="input-icon">
				<i class="fa fa-user"></i>
				<input class="form-control placeholder-no-fix" type="text" autocomplete="off" placeholder="Username" name="username"/>
			</div>
		</div>
		<div class="form-group">
			<label class="control-label visible-ie8 visible-ie9">Password</label>
			<div class="input-icon">
				<i class="fa fa-lock"></i>
				<input class="form-control placeholder-no-fix" type="password" autocomplete="off" placeholder="Password" name="password"/>
			</div>
		</div>
        <?php if(isset($_REQUEST['f'])){?>
            <div class="clearfix alert alert-error" style="font-size:11px;width:147px;margin-bottom: 5px;">
                Login failed
                <?php if(isset($_REQUEST['fm'])){
                    echo $_REQUEST['fm'];
                }?>
            </div>
        <?php } ?>
		<div class="form-actions">
			<label class="checkbox">
			<input type="checkbox" name="remember" value="1"/> Remember me </label>
			<button type="submit" class="btn green pull-right">
			Login <i class="m-icon-swapright m-icon-white"></i>
			</button>
		</div>
        <hr>
		<div class="forget-password">
			<h4>Forgot your password ?</h4>
			<p>
				 no worries, click <a onclick="showForgotPassword();return false;" id="forget-password">
				here </a>
				to reset your password.
			</p>
		</div>
		
	</form>
        <form class="forget-form" action="">
            <h3>Forget Password ?</h3>
            <p>
                Enter your e-mail address below to reset your password.
            </p>
            <div class="form-group">
                <div class="input-icon">
                    <i class="fa fa-envelope"></i>
                    <input class="form-control placeholder-no-fix" type="text" autocomplete="off" placeholder="Email" name="email"/>
                </div>
            </div>
            <div class="form-actions">
                <button type="button" id="back-btn" class="btn">
                    <i class="m-icon-swapleft"></i> Back </button>
                <button type="submit" class="btn green pull-right" onclick="changePassword();return false;">
                    Submit <i class="m-icon-swapright m-icon-white"></i>
                </button>
            </div>
        </form>
    <?php }else{?>
        <form id="newPasswordForm" action="">
            <fieldset>
                <div class="clearfix">
                    <div class="input-prepend">
                        <span class="add-on"><i class="icon-lock"></i></span>
                        <input class="span2" type="password" id="password" name="password" placeholder="New Password">
                    </div>
                </div>
                <div id="newPasswordFormAlert" class="clearfix alert alert-error" style="font-size:11px;width:147px;margin-bottom: 5px;display:none;">

                </div>
                <button class="btn" style="margin-top: 5px;" type="button" onclick="changePassword();return false;">Change Password&nbsp;&nbsp;<span class="icon-arrow-right"></span></button>
            </fieldset>
        </form>
    <?php }?>
	<!-- END LOGIN FORM -->
	<!-- BEGIN FORGOT PASSWORD FORM -->

	<!-- END FORGOT PASSWORD FORM -->
	</div>
<!-- END LOGIN -->
<!-- BEGIN COPYRIGHT -->
<div class="copyright_uni">
	 2015 &copy; PCP Intranet<br>
     Proudly Powered by Ingenuity Studio
     
</div>

<!-- END COPYRIGHT -->
<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->
<!-- BEGIN CORE PLUGINS -->
<!--[if lt IE 9]>
<script src="<?=BASE_URL?>/assets/global/plugins/respond.min.js"></script>
<script src="<?=BASE_URL?>/assets/global/plugins/excanvas.min.js"></script>
<![endif]-->
<script src="<?=BASE_URL?>/assets/global/plugins/jquery.min.js" type="text/javascript"></script>
<script src="<?=BASE_URL?>/assets/global/plugins/jquery-migrate.min.js" type="text/javascript"></script>
<script src="<?=BASE_URL?>/assets/global/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
<script src="<?=BASE_URL?>/assets/global/plugins/jquery.blockui.min.js" type="text/javascript"></script>
<script src="<?=BASE_URL?>/assets/global/plugins/uniform/jquery.uniform.min.js" type="text/javascript"></script>
<script src="<?=BASE_URL?>/assets/global/plugins/jquery.cokie.min.js" type="text/javascript"></script>
<!-- END CORE PLUGINS -->
<!-- BEGIN PAGE LEVEL PLUGINS -->
<script src="<?=BASE_URL?>/assets/global/plugins/jquery-validation/js/jquery.validate.min.js" type="text/javascript"></script>
<script src="<?=BASE_URL?>/assets/global/plugins/backstretch/jquery.backstretch.min.js" type="text/javascript"></script>
<script type="text/javascript" src="<?=BASE_URL?>/assets/global/plugins/select2/select2.min.js"></script>
<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="<?=BASE_URL?>/assets/global/scripts/metronic.js" type="text/javascript"></script>
<script src="<?=BASE_URL?>/assets/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="<?=BASE_URL?>/assets/admin/layout/scripts/demo.js" type="text/javascript"></script>
<script src="<?=BASE_URL?>/assets/admin/pages/scripts/login-soft.js" type="text/javascript"></script>
<!-- END PAGE LEVEL SCRIPTS -->
<script>
jQuery(document).ready(function() {     
  Metronic.init(); // init metronic core components
Layout.init(); // init current layout
  Login.init();
  Demo.init();
       // init background slide images
       $.backstretch([
        "<?=BASE_URL?>/img/bg/1.jpg",
        "<?=BASE_URL?>/img/bg/2.jpg",
        "<?=BASE_URL?>/img/bg/3.jpg",
        "<?=BASE_URL?>/img/bg/4.jpg"
        ], {
          fade: 1000,
          duration: 8000
    }
    );
});
</script>
<!-- END JAVASCRIPTS -->
</body>
<!-- END BODY -->
</html>