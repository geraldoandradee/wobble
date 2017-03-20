<?php

# WOBBLE_HOME can be provided by the PHP Environment, e.g. through a .htaccess file
# It describes, where other script files are located.
if (!defined('WOBBLE_HOME')) {
  define('WOBBLE_HOME', dirname(__FILE__) . '/../..');
}
require_once WOBBLE_HOME . '/WobbleApi/Autoload.php';
require_once WOBBLE_HOME . '/WobbleApi/handlers/api_metrics.php';

$metrics = wobble_metrics([]);


header('Content-Type: text/plain; version=0.0.4');
foreach($metrics as $key => $value) {
	if (!empty($value['help'])) {
		print "# HELP ${value['name']} ${value['help']}\n";
	}
	if (!empty($value['type'])) {
		print "# TYPE ${value['name']} ${value['type']}\n";
	}

	if (is_array($value['values'])) {
		foreach($value['values'] as $tag => $v) {
			print $value['name'] . '{' . $tag . "} $v\n";
		}
	} else {
		print "${value['name']} ${value['values']}\n";
	}
	print "\n";
}


