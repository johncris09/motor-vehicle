<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class CashAdvance extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('CashAdvanceModel');

	}

	public function index_get()
	{
		$cashAdvanceModel = new CashAdvanceModel;
		$result = $cashAdvanceModel->get();
		$this->response($result, RestController::HTTP_OK);
	}



	public function total_get()
	{
		$cashAdvanceModel = new CashAdvanceModel;
		$total = $cashAdvanceModel->get_total()->total_amount ? $cashAdvanceModel->get_total()->total_amount : 0;

		
		$this->response(number_format($total, 2, '.', ','), RestController::HTTP_OK);

	}

	public function find_get($id)
	{

		$cashAdvanceModel = new CashAdvanceModel;
		$result = $cashAdvanceModel->find($id);
		$this->response($result, RestController::HTTP_OK);

	}


	public function insert_post()
	{

		$cashAdvanceModel = new CashAdvanceModel;
		$requestData = json_decode($this->input->raw_input_stream, true);


		$data = array(
			'amount' => trim($requestData['amount']),

		);



		$result = $cashAdvanceModel->insert($data);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Inserted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create new cash advance.'
			], RestController::HTTP_BAD_REQUEST);
		}
	}

	public function update_put($id)
	{


		$cashAdvanceModel = new CashAdvanceModel;
		$requestData = json_decode($this->input->raw_input_stream, true);
		if (isset($requestData['amount'])) {
			$data['amount'] = trim($requestData['amount']);
		}
		$update_result = $cashAdvanceModel->update($id, $data);

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
		$cashAdvanceModel = new CashAdvanceModel;
		$result = $cashAdvanceModel->delete($id);
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
