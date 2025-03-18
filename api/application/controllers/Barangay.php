<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Barangay extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('BarangayModel');

	}

	public function index_get()
	{
		$barangayModel = new BarangayModel;
		$result = $barangayModel->get();
		$this->response($result, RestController::HTTP_OK);
	}


	public function find_get($id)
	{

		$barangayModel = new BarangayModel;
		$result = $barangayModel->find($id);
		$this->response($result, RestController::HTTP_OK);

	}


	public function insert_post()
	{

		$barangayModel = new BarangayModel;
		$requestData = json_decode($this->input->raw_input_stream, true);


		$data = array(
			'barangay' => $requestData['barangay'],  
		);



		$result = $barangayModel->insert($data);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Inserted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create new user.'
			], RestController::HTTP_BAD_REQUEST);
		}
	}

	public function update_put($id)
	{


		$barangayModel = new BarangayModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		if (isset($requestData['barangay'])) {
			$data['barangay'] = $requestData['barangay'];
		} 
		$update_result = $barangayModel->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


	public function delete_delete($id)
	{
		$barangayModel = new BarangayModel;
		$result = $barangayModel->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


}
