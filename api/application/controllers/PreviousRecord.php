<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class PreviousRecord extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('PreviousRecordModel');

	}

	public function index_get()
	{
		$previousRecordModel = new PreviousRecordModel;
		$result = $previousRecordModel->get();
		$this->response($result, RestController::HTTP_OK);
	}
 


}
