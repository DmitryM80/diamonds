<?php
class ControllerCommonHome extends Controller {
	public function index() {
		$this->document->setTitle($this->config->get('config_meta_title'));
		$this->document->setDescription($this->config->get('config_meta_description'));
		$this->document->setKeywords($this->config->get('config_meta_keyword'));

		if (isset($this->request->get['route'])) {
			$canonical = $this->url->link('common/home');
			if ($this->config->get('config_seo_pro') && !$this->config->get('config_seopro_addslash')) {
				$canonical = rtrim($canonical, '/');
			}
			$this->document->addLink($canonical, 'canonical');
		}

		$this->load->model('catalog/product');
		$this->load->model('tool/image');
		$brilliants = $this->model_catalog_product->getProducts(array('filter_category_id' => 59));
		$data['brilliants'] = array();

		foreach ($brilliants as $brilliant) {
			$brilliant['brilliant_attributes'] = $this->model_catalog_product->getProductAttributes($brilliant['product_id']);
			$brilliant['main_image'] = $data['popup'] = $this->model_tool_image->resize($brilliant['image'], 384, 384);
			$brilliant['href'] = $this->url->link('product/product', 'product_id=' . $brilliant['product_id']);
			$data['brilliants'][] = $brilliant;
		}

		$data['ct'] = 'ct';
		// dp($data['brilliants']);

		// $data['wishlist'] = $this->url->link('account/wishlist', '', true);

		$data['column_left'] = $this->load->controller('common/column_left');
		$data['column_right'] = $this->load->controller('common/column_right');
		$data['content_top'] = $this->load->controller('common/content_top');
		$data['content_bottom'] = $this->load->controller('common/content_bottom');
		$data['footer'] = $this->load->controller('common/footer');
		$data['header'] = $this->load->controller('common/header');

		$this->response->setOutput($this->load->view('common/home', $data));
	}
}