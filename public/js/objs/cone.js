{
	"metadata": {
		"version": 4.3,
		"type": "object",
		"generator": "ObjectExporter"
	},
	"geometries": [
		{
			"uuid": "26DC3AEE-1549-4422-86B6-A6518D1096A9",
			"type": "CylinderGeometry",
			"radiusTop": 20,
			"radiusBottom": 58,
			"height": 100,
			"heightSegments": 1
		},
		{
			"uuid": "E79E11B4-849A-40A6-8022-40F92C428CA0",
			"type": "SphereGeometry",
			"radius": 59,
			"widthSegments": 32,
			"heightSegments": 16,
			"phiStart": 0,
			"phiLength": 6.28,
			"thetaStart": 0,
			"thetaLength": 3.14
		}],
	"materials": [
		{
			"uuid": "3C1346CA-AA72-459D-87C9-94AE3099FB8A",
			"type": "MeshPhongMaterial",
			"color": 16777215,
			"ambient": 16777215,
			"emissive": 0,
			"specular": 1118481,
			"shininess": 30,
			"opacity": 1,
			"transparent": false,
			"wireframe": false
		},
		{
			"uuid": "8EFB6181-561E-4157-A7A7-48D60E77A3A9",
			"type": "MeshPhongMaterial",
			"color": 16055165,
			"ambient": 16777215,
			"emissive": 0,
			"specular": 1118481,
			"shininess": 30,
			"opacity": 1,
			"transparent": false,
			"wireframe": false
		}],
	"object": {
		"uuid": "84718C64-71D6-4A31-B7AC-11D2C854647F",
		"name": "Base",
		"type": "Mesh",
		"geometry": "26DC3AEE-1549-4422-86B6-A6518D1096A9",
		"material": "3C1346CA-AA72-459D-87C9-94AE3099FB8A",
		"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,50,0,1],
		"children": [
			{
				"uuid": "EE4E95CA-18DD-4591-8214-CB8650FB9129",
				"name": "Sphere 2",
				"type": "Mesh",
				"geometry": "E79E11B4-849A-40A6-8022-40F92C428CA0",
				"material": "8EFB6181-561E-4157-A7A7-48D60E77A3A9",
				"matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,100,0,1]
			}]
	}
}