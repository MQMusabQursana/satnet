<?php 
session_start();
// hide all error
// error_reporting(0);
// protect .php
$get_self = explode("/",$_SERVER['PHP_SELF']);
$self[] = $get_self[count($get_self)-1];

if($self[0] !== "index.php"  && $self[0] !==""){
    include_once("../core/route.php");

}else{

include_once("config/connection.php");


$get_monitor = $API->comm("/tool/netwatch/print");


if(!isMobile()){ 

    $monitoring_ma = "sidenav_active";
    
    include_once("view/header_html.php");
    include_once("view/menu.php");
?>
<div class="main">
    <div class="row">
        <div class="col-12">
            <div class="card card-shadow">
            <div class="card-header">
                <span><i class="fa fa-send"></i>&nbsp; <b>Netwatch</b> &nbsp; </span>
            </div>
            <div class="card-body">
            <div class="btn-group">
                <button class="bg-btn-group table-total" >
                    <?php echo count($get_monitor); ?>
                </button>
                <input type="text" autocomplete = "off" id="filter-log" onkeyup="filterTable('log','searchLog',this.value)" placeholder="Cari ....." />
                <button class="bg-btn-group" onclick="filterTable('log','filter-log','')" title="Clear filter"><i class="fa fa-filter" ></i></button>
            </div>
            <div class="card-fixed mr-t-10">
                <table class="table table-bordered table-hover slog">
                    <thead>
                      <tr>
                        <th>Comment</th>
                        <th>Status</th>
                        <th>Host</th>
                      </tr>
                    </thead>
                    <tbody  id="monitoring">
                  <?php 

                  foreach( $get_monitor as $index => $baris ) : ?>

                    <tr>
                    <td>
                            <?php  
                            $val_comment = ucwords($baris['comment']);

                            if (strlen($val_comment) <= 0) {
                                echo '<i class="fa fa-ban text-primary"></i>';
                            }else{
                                echo ucwords($baris['comment']);
                            }

                            ?>
                    </td>
                    <td>
                            <?php 

                            $cek_status = $baris['status'];
                            // echo $cek_status;
                            if ($cek_status == "up") {
                            	echo '<span title="UP" class="text-bold pointer text-green"><i class="fa fa-lightbulb-o text-green"></i> '.ucfirst($cek_status).'</span>';
                            }else if($cek_status == "down"){
                            	echo '<span title="Up" class="text-bold pointer text-red"><i class="fa fa-lightbulb-o text-red"></i> '.ucfirst($cek_status).'</span>';
                            }else{
                            	echo '<span title="Disabled" class="text-bold pointer"><i class="fa fa-times-circle"></i> '.ucfirst("off").'</span>';
                            }

                        	?>
                    </td>
                    <td>
                            <?php echo $baris['host'];?>
                    </td>
                  	</tr>

                    <?php endforeach; ?>

                    </tbody>
                  </table>
            </div>
            </div>
            <div class="card-footer"><span id="loading"></span> </div>
            </div>
        </div>
    </div>
</div>
<?php 

}else if(isMobile()){ 

  $monitoring_ma = "nav_active";
  $navicon = '<i class="fa fa-send"></i>';
    
    include_once("view/header_html.php");
    include_once("view/menu.php");

  ?>

<div class="main-mobile">
    <div class="row" style="padding-top:15px; padding-bottom:100px">
        <div class="col-12">
            <div class="mobile-card ">
            
                <h3><i class="fa fa-send"></i>&nbsp; Netwatch &nbsp; <span id="loaginHeader"></span></h3>
           
            <div class="card-body">
            <div class="btn-group">
                <button class="bg-btn-group table-total" >
                    <?php echo count($get_monitor); ?>
                </button>
                <input type="text" autocomplete = "off" id="filter-log" onkeyup="filterTable('log','searchLog',this.value)" placeholder="Cari ....." />
                <button class="bg-btn-group" onclick="filterTable('log','filter-log','')" title="Clear filter"><i class="fa fa-filter" ></i></button>
            </div>
            <div class="card-fixed mr-t-10">
                <table class="table table-bordered table-hover slog">
                    <thead>
                      <tr>
                        <th>Comment</th>
                        <th>Status</th>
                        <th>Host</th>
                      </tr>
                    </thead>
                    <tbody  id="monitoring">
                  <?php 
                  foreach( $get_monitor as $index => $baris ) : ?>

                    <tr>
                    <td>
                            <?php  
                            $val_comment = ucwords($baris['comment']);

                            if (strlen($val_comment) <= 0) {
                                echo '<i class="fa fa-ban text-primary"></i>';
                            }else{
                                echo ucwords($baris['comment']);
                            }

                            ?>
                    </td>
                    <td>
                            <?php 

                            $cek_status = $baris['status'];
                            // echo $cek_status;
                            if ($cek_status == "up") {
                                echo '<span title="UP" class="text-bold pointer text-green"><i class="fa fa-lightbulb-o text-green"></i> '.ucfirst($cek_status).'</span>';
                            }else if($cek_status == "down"){
                                echo '<span title="Up" class="text-bold pointer text-red"><i class="fa fa-lightbulb-o text-red"></i> '.ucfirst($cek_status).'</span>';
                            }else{
                                echo '<span title="Disabled" class="text-bold pointer"><i class="fa fa-times-circle"></i> '.ucfirst("off").'</span>';
                            }

                            ?>
                    </td>
                    <td>
                            <?php echo $baris['host'];?>
                    </td>
                    </tr>

                    <?php endforeach; ?>
                    </tbody>
                  </table>
            </div>
            </div>
            <div class="card-footer"><span id="loading"></span> </div>
            </div>
        </div>
    </div>
</div>


<?php } ?>
<script>
    
$(document).ready(function() {
    // loadMonitoring()



    $(".slog").fancyTable({
    inputId: "searchLog",          
    sortColumn:0,
    pagination: true,
    perPage:20,
    globalSearch:true,
    paginationClass: "btn btn-bordered",
    paginationClassActive:"bg-primary",

    });  


})


</script>

<?php
include_once("view/footer_html.php");
}
?>
