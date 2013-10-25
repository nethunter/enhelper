<?php
$data = json_decode(file_get_contents('reg.json'));

if (!$data) {
    $data = array(
        'ids' => array(),
        'phone' => ''
    );
}

if (isset($_GET['add'])) {
    $regID = $_GET['add'];
    
    $data->ids[] = $regID;
    file_put_contents('reg.json', json_encode($data));
}

if (isset($_GET['setPhone'])) {
    $regID = $_GET['setPhone'];
    
    $data->phone = $regID;
    file_put_contents('reg.json', json_encode($data));
}

echo file_get_contents('reg.json');
