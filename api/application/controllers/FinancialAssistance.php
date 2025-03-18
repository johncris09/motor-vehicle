<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class FinancialAssistance extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('FinancialAssistanceTypeModel');
		$this->load->model('ClaimModel');
		$this->load->model('CashAdvanceModel');

	}

	public function index_get()
	{
		$financialAssistanceTypeModel = new FinancialAssistanceTypeModel;
		$result = $financialAssistanceTypeModel->get();
		$this->response($result, RestController::HTTP_OK);
	}

	public function get_total_by_financial_assistance_type_get()
	{

		$financialAssistanceTypeModel = new FinancialAssistanceTypeModel;
		$claimModel = new ClaimModel;



		$financial_assistance_type = $financialAssistanceTypeModel->get();

		$data = [];
		foreach ($financial_assistance_type as $row) {
			// get total amount by financial assistance type
			$total_amount = $claimModel->total_amount_by_type($row->id);

			$data[] = array(
				'type' => $row->type,
				'total_amount' => number_format( $total_amount ? $total_amount : '0', 2, '.', ',')
			);


		}
		$this->response($data, RestController::HTTP_OK);
	}


	public function remaining_balance_get()
	{

		$financialAssistanceTypeModel = new FinancialAssistanceTypeModel;
		$claimModel = new ClaimModel;


		$cashAdvanceModel = new CashAdvanceModel;


		$total_cash_advance = $cashAdvanceModel->get_total()->total_amount ? $cashAdvanceModel->get_total()->total_amount : 0;
		$total_claim = $claimModel->get_total()->total_amount ? $claimModel->get_total()->total_amount : 0;

		$total = (float) $total_cash_advance - (float) $total_claim;

		$this->response(number_format($total, 2, '.', ','), RestController::HTTP_OK);

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
