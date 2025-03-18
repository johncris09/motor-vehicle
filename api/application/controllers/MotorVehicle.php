<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class MotorVehicle extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('MotorVehicleModel');

	}

	public function index_get()
	{
		$motorVehicleModel = new MotorVehicleModel;
		$result = $motorVehicleModel->get();
		$this->response($result, RestController::HTTP_OK);
	}

	public function lto_notify_get()
	{
		$motorVehicleModel = new MotorVehicleModel;
		$result = $motorVehicleModel->get();
		$requestData = $this->get();

		$today = new DateTime(); // Current date
		$currentMonth = (int) $today->format('m'); // Extract current month

		$expirationMonths = [12, 11, 2, 5,4, 6,7]; // Expiration months only
		$items = array(
			array(
				'id' => 1,
                'name' => 'Toyota Camry',
                'year' => 2022,
                'brand' => 'Toyota',
                'model' => 'Camry',
				'color' => 'White',
				'expirationMonths' => 12,
			),
			array(
				'id' => 2,
				'name' => 'Honda Civic',
				'year' => 2022,
                'brand' => 'Honda',
                'model' => 'Civic',
                'color' => 'Black',
                'expirationMonths' => 11,
			),
			array(
				'id' => 3,
				'name' => 'Ford Fusion',
                'year' => 2022,
                'brand' => 'Ford',
                'model' => 'Fusion',
                'color' => 'Red',
				'expirationMonths' => 2,
			),
			array(
				'id' => 4,
				'name' => 'Nissan Altima',
				'year' => 2022,
                'brand' => 'Nissan',
                'model' => 'Altima',
                'color' => 'Blue',
                'expirationMonths' => 5,
			),
			array(
				'id' => 5,
				'name' => 'Chevrolet Cruze',
				'year' => 2022,
                'brand' => 'Chevrolet',
                'model' => 'Cruze',
                'color' => 'Silver',
                'expirationMonths' => 6,
			),
			array(
				'id' => 6,
				'name' => 'Volkswagen Golf',
				'year' => 2022,
				'brand' => 'Volkswagen',
				'model' => 'Golf',
				'color' => 'Green',
				'expirationMonths' => 5
			),
			array(
                'id' => 7,
                'name' => 'BMW 3 Series',
                'year' => 2022,
                'brand' => 'BMW',
				'model' => '3 Series',
				'color' => 'Black',
				'expirationMonths' => 6
			),
			array(
                'id' => 8,
                'name' => 'Mercedes-Benz E-Class',
                'year' => 2022,
                'brand' => 'Mercedes-Benz',
				'model' => 'E-Class',
                'color' => 'White',
                'expirationMonths' => 5
			),
		);

		foreach ($result  as $row) {
			print_r($row);
			echo "<br />";
			echo "<br />";
			echo "<br />";
			// Calculate the difference between expiration month and current month
			// $diff = $item['expirationMonths'] - $currentMonth;

			// // Handle cases where the expiration month is in the next year
			// if ($diff < 0) {
			// 	$diff += 12; // Wrap around for negative values
			// }
			
			// // Notify if the expiration is within the next 3 months
			// if ($diff > 0 && $diff <= $requestData['months']) {
			// 	echo "Notify: Expiration month ".$item['name']." is in $diff month(s)! <br />";
			// }
		}

		// $this->response($requestData, RestController::HTTP_OK);

	}


	public function find_get($id)
	{

		$motorVehicleModel = new MotorVehicleModel;
		$result = $motorVehicleModel->find($id);
		$this->response($result, RestController::HTTP_OK);

	}


	public function insert_post()
	{

		$motorVehicleModel = new MotorVehicleModel;
		$requestData = json_decode($this->input->raw_input_stream, true);


		$data = array(
			'office' => $requestData['office'],
			'plate_number' => $requestData['plate_number'],
			'model' => $requestData['model'],
			'engine_number' => $requestData['engine_number'],
			'chassis_number' => $requestData['chassis_number'],
			'date_acquired' => $requestData['date_acquired'],
			'cost' => $requestData['cost'],
			'color' => $requestData['color'],
			'status' => $requestData['status'],
			'return_number' => $requestData['return_number'],
			'return_date' => $requestData['return_date'],
			'vehicle_type' => $requestData['vehicle_type'],
			'quantity' => $requestData['quantity'],
			'fuel_type' => $requestData['fuel_type'],
			'end_user' => $requestData['end_user'],
			'designated_driver' => implode(', ', $requestData['designated_driver']),
			'vehicle_use' => implode(', ', $requestData['vehicle_use']),
			'cylinder_number' => $requestData['cylinder_number'],
			'engine_displacement' => $requestData['engine_displacement'],
			'gsis_date_renew' => $requestData['gsis_date_renew'],
			'gsis_period_cover' => $requestData['gsis_period_cover'],
			'gsis_or_number' => $requestData['gsis_or_number'],
			'lto_date_renew' => $requestData['lto_date_renew'],
			'lto_period_cover' => $requestData['lto_period_cover'],
			'lto_or_number' => $requestData['lto_or_number'],
			'remarks' => $requestData['remarks']
		);

		$result = $motorVehicleModel->insert($data);

		$this->response($result, RestController::HTTP_OK);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Inserted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create new motor vehicle.'
			], RestController::HTTP_OK);
		}
	}

	public function update_put($id)
	{


		$motorVehicleModel = new MotorVehicleModel;
		$requestData = json_decode($this->input->raw_input_stream, true);
		if (isset($requestData['office'])) {
			$data['office'] = $requestData['office'];
		}
		if (isset($requestData['plate_number'])) {
			$data['plate_number'] = $requestData['plate_number'];
		}
		if (isset($requestData['model'])) {
			$data['model'] = $requestData['model'];
		}
		if (isset($requestData['engine_number'])) {
			$data['engine_number'] = $requestData['engine_number'];
		}
		if (isset($requestData['chassis_number'])) {
			$data['chassis_number'] = $requestData['chassis_number'];
		}
		if (isset($requestData['date_acquired'])) {
			$data['date_acquired'] = $requestData['date_acquired'];
		}
		if (isset($requestData['cost'])) {
			$data['cost'] = $requestData['cost'];
		}
		if (isset($requestData['color'])) {
			$data['color'] = $requestData['color'];
		}
		if (isset($requestData['status'])) {
			$data['status'] = $requestData['status'];
		}
		if (isset($requestData['return_number'])) {
			$data['return_number'] = $requestData['return_number'];
		}
		if (isset($requestData['return_date'])) {
			$data['return_date'] = $requestData['return_date'];
		}
		if (isset($requestData['vehicle_type'])) {
			$data['vehicle_type'] = $requestData['vehicle_type'];
		}
		if (isset($requestData['quantity'])) {
			$data['quantity'] = $requestData['quantity'];
		}
		if (isset($requestData['fuel_type'])) {
			$data['fuel_type'] = $requestData['fuel_type'];
		}
		if (isset($requestData['end_user'])) {
			$data['end_user'] = $requestData['end_user'];
		}
		if (isset($requestData['designated_driver'])) {
			$data['designated_driver'] = implode(', ', $requestData['designated_driver']);
		}
		if (isset($requestData['vehicle_use'])) {
			$data['vehicle_use'] = implode(', ', $requestData['vehicle_use']);
		}
		if (isset($requestData['cylinder_number'])) {
			$data['cylinder_number'] = $requestData['cylinder_number'];
		}
		if (isset($requestData['engine_displacement'])) {
			$data['engine_displacement'] = $requestData['engine_displacement'];
		}

		if (isset($requestData['gsis_date_renew'])) {
			$data['gsis_date_renew'] = $requestData['gsis_date_renew'];
		}
		if (isset($requestData['gsis_period_cover'])) {
			$data['gsis_period_cover'] = $requestData['gsis_period_cover'];
		}
		if (isset($requestData['gsis_or_number'])) {
			$data['gsis_or_number'] = $requestData['gsis_or_number'];
		}
		if (isset($requestData['lto_date_renew'])) {
			$data['lto_date_renew'] = $requestData['lto_date_renew'];
		}
		if (isset($requestData['lto_period_cover'])) {
			$data['lto_period_cover'] = $requestData['lto_period_cover'];
		}
		if (isset($requestData['lto_or_number'])) {
			$data['lto_or_number'] = $requestData['lto_or_number'];
		}

		if (isset($requestData['remarks'])) {
			$data['remarks'] = $requestData['remarks'];
		}

		$update_result = $motorVehicleModel->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update.'
			], RestController::HTTP_OK);

		}
	}


	public function delete_delete($id)
	{
		$motorVehicleModel = new MotorVehicleModel;
		$result = $motorVehicleModel->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete.'
			], RestController::HTTP_OK);

		}
	}

	public function get_report_get()
	{
		$motorVehicleModel = new MotorVehicleModel;
		$requestData = $this->input->get();

		$data = [];
		if (isset($requestData['status'])) {
			$data['status'] = $requestData['status'];
		}

		if (isset($requestData['office'])) {
			$data['office'] = $requestData['office'];
		}
		$result = $motorVehicleModel->get_report($data);


		$this->response($result, RestController::HTTP_OK);
	}
}
