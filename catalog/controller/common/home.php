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

		$this->load->language('common/home');
		$this->load->model('catalog/product');
		$this->load->model('tool/image');

		if (isset($this->request->get['sort'])) {
			$sort = $this->request->get['sort'];
			$this->document->setRobots('noindex,follow');
		} else {
			$sort = 'p.sort_order';
		}

		if (isset($this->request->get['order'])) {
			$order = $this->request->get['order'];
			$this->document->setRobots('noindex,follow');
		} else {
			$order = 'ASC';
		}		

		$filter_data = array(
			'filter_category_id' => 59,
			'sort'               => $sort,
			'order'              => $order
		);


		// $brilliants = $this->model_catalog_product->getProducts(array('filter_category_id' => 59));
		$brilliants = $this->model_catalog_product->getProducts($filter_data);
		$data['brilliants'] = array();

		foreach ($brilliants as $brilliant) {
			$brilliant['brilliant_attributes'] = $this->model_catalog_product->getProductAttributes($brilliant['product_id']);
			$brilliant['main_image'] = $data['popup'] = $this->model_tool_image->resize($brilliant['image'], 384, 384);
			$brilliant['href'] = $this->url->link('product/product', 'product_id=' . $brilliant['product_id']);
			$data['brilliants'][] = $brilliant;
		}

		$data['ct'] = 'ct';

		$url = '#nav-profile';
		
		$data['sorts'] = array();

		$data['sorts'][] = array(
			'text'  => $this->language->get('text_price_asc'),
			'value' => 'p.price-ASC',
			'href'  => $this->url->link('common/home', '&sort=p.price&order=ASC' . $url)
		);

		$data['sorts'][] = array(
			'text'  => $this->language->get('text_price_desc'),
			'value' => 'p.price-DESC',
			'href'  => $this->url->link('common/home', '&sort=p.price&order=DESC' . $url)
		);

		$data['sorts'][] = array(
			'text'  => $this->language->get('text_weight_asc'),
			'value' => 'p.weight-ASC',
			'href'  => $this->url->link('common/home', '&sort=p.weight&order=ASC' . $url)
		);

		$data['sorts'][] = array(
			'text'  => $this->language->get('text_weight_desc'),
			'value' => 'p.weight-DESC',
			'href'  => $this->url->link('common/home', '&sort=p.weight&order=DESC' . $url)
		);
		

		$data['column_left'] = $this->load->controller('common/column_left');
		$data['column_right'] = $this->load->controller('common/column_right');
		$data['content_top'] = $this->load->controller('common/content_top');
		$data['content_bottom'] = $this->load->controller('common/content_bottom');
		$data['footer'] = $this->load->controller('common/footer');
		$data['header'] = $this->load->controller('common/header');

		$this->response->setOutput($this->load->view('common/home', $data));
	}
}