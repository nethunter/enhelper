<?php
$headers = array("Content-Type: application/json", "Authorization: " . "key=" . "AIzaSyAtlVSSkqqWCaosXFJhqz2pI4Cc-p6n7lM");
$data = array(
	'data' => array(
		'app' => 'waze',
		'coord' => $argv[1]
	),
	'registration_ids' => array("APA91bHg0SuPElQnRhia0S1zztFLr322L2hfyC5xbTMXRPKrKUQ0b9ExwhTlnhoif24ibJLtKcz-Tp-rAlsXdXjoWDMutTmBcPxCrXhJOzWpSOtVQmLsXrMj9mtQv-F0_GoQYC8stLFnUiwsLAhQ9Ih-Z-hLNYfNpQ")
);

$ch = curl_init();

curl_setopt($ch, CURLOPT_HTTPHEADER, $headers); 
curl_setopt($ch, CURLOPT_URL, "https://android.googleapis.com/gcm/send");
curl_setopt ($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
error_log(json_encode($data));
$response = curl_exec($ch);
curl_close($ch);
error_log($response);
