<?php 
session_start();
// hide all error
error_reporting(0);
// protect .php
$get_self = explode("/",$_SERVER['PHP_SELF']);
$self[] = $get_self[count($get_self)-1];

if($self[0] !== "index.php"  && $self[0] !==""){
    include_once("../core/route.php");

}else{
    $is_mobile = $_GET['mobile'];
$detail = '
<div class="pd-10">
    <?= $sasa ?>
    <h2>SATNET</h2>

    <p>
        <a href="https://pentol.my.id">pentol.my.id</a>
    </p>
    <div>
        <i>Copyright &copy; 2017 -'.date("Y").' https://pentol.my.idt</i>
    </div>
</div>    
    ';

if(!isMobile()){

    $about_ma = "sidenav_active";
   
    include_once("view/header_html.php");
    include_once("view/menu.php");
?>
<div class="main unselect">
    <div class="row">
        <div class="col-12">
            <div class="card card-shadow">
            <div class="card-header">
                <span><i class="fa fa-info-circle"></i> <b>About</b></span>
            </div>
            <div class="card-body">
            <?= $detail ?>
            </div>
            <div class="card-footer"><span id="loading"></span> </div>
            </div>
        </div>
    </div>
</div>
<?php 

}else if(isMobile()){ 

  $about_ma = "nav_active";
  $navicon = '<i class="fa fa-info-circle"></i>' ;
    include_once("view/header_html.php");
    include_once("view/menu.php");

  ?>

<div class="main-mobile">
  
    <div class="row">
    <div style="margin-top:50px;margin-bottom:30px;" >

<div class="group-icon-mobile" style="margin: auto; width:100%">
  <i class="fa fa-info-circle" style="font-size:60px" ></i>
  <h3>About</h3>
  </div> 

  
  </div>
        <div class="col-12">
            <div class="mobile-card ">
                <h3><i class="fa fa-info-circle"></i> About</h3>
            <div class="card-body">
            <?= $detail ?>
            </div>
            <div class="card-footer"><span id="loading"></span> </div>
            </div>
        </div>
    </div>
</div>


<?php } 
include_once("view/footer_html.php");
}
?>
