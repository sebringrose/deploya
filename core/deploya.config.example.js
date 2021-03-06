export default {
	"application": "example-app",
	"description": "an example application used for testing Deploya",
	"environemnt": "staging",
	"platform": "AWS",
	"service": "elasticbeanstalk",
	"region": "eu-west-2",
	"hardware": {
		"CPU": {
			"cores": 1
		},
		"RAM": {
			"size": 512
		},
		"disk": {
			"size": 8
		}	
	},
	"network": {
		"ports": [
			80,
			443
		]
	},
	"scaling": {
		"min_servers": 1,
		"max_servers": 4,
		"scale_up": {
			"CPU": {
				"usage": 99
			},
			"RAM": {
				"usage": 95
			}
		},
		"scale_down": {
			"network": {
				"in": 1
			}
		}
	},
	"additional_services": {
		"database": {
			"schema": "SQL",
			"min_storage": 10,
			"max_storage": 20
		},
		"file_storage": {
			"min_storage": 10,
			"max_storage": 20
		}
	}
}