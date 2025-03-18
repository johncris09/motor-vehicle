<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class FinancialAssistanceType extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('FinancialAssistanceTypeModel');

	}

	public function index_get()
	{
		$financialAssistanceTypeModel = new FinancialAssistanceTypeModel;
		$result = $financialAssistanceTypeModel->get();
		$this->response($result, RestController::HTTP_OK);
	}
	
	// Total Number of Financial Assistance
	public function total_get()
	{
		$financialAssistanceTypeModel = new FinancialAssistanceTypeModel;
		$result = $financialAssistanceTypeModel->total();
		$this->response($result, RestController::HTTP_OK);
	}



	public function find_get($id)
	{

		$financialAssistanceTypeModel = new FinancialAssistanceTypeModel;
		$result = $financialAssistanceTypeModel->find($id);
		$this->response($result, RestController::HTTP_OK);

	}


	public function insert_post()
	{

		$financialAssistanceTypeModel = new FinancialAssistanceTypeModel;
		$requestData = json_decode($this->input->raw_input_stream, true);


		$data = array(
			'type' => $requestData['type'],
			'amount' => $requestData['amount'],
			'description' => $requestData['description'],


		);



		$result = $financialAssistanceTypeModel->insert($data);

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


		$financialAssistanceTypeModel = new FinancialAssistanceTypeModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		if (isset($requestData['type'])) {
			$data['type'] = $requestData['type'];
		}
		if (isset($requestData['amount'])) {
			$data['amount'] = $requestData['amount'];
		}
		if (isset($requestData['description'])) {
			$data['description'] = $requestData['description'];
		}

		$update_result = $financialAssistanceTypeModel->update($id, $data);

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
		$financialAssistanceTypeModel = new FinancialAssistanceTypeModel;
		$result = $financialAssistanceTypeModel->delete($id);
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
