<?php
function e7061($e){
	$ed = base64_decode($e);
	$n = openssl_decrypt("$ed","AES-256-CBC","vstnoldotmydotid",0,"0410138112965713");
	return $n;
}
?>
