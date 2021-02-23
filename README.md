# SETUP

Add a ```.env``` file to the directory with the following content

```
CINODE_ACCESSID=XXX
CINODE_ACCESSSECRET=YYY
CINODE_COMPANYID=nnnn
```

## Example run

Case 1:
```
$ node index.js gcp terraform node
SEARCH:  [ 'gcp', 'terraform', 'node' ]
FOUND: 2 people
Person One
	 Node.js 3
	 Terraform 3
	 GCP 3
Person Two
	 Node.js 5
	 Terraform 3
	 GCP 3
```

Case 2:
```
$ node index.js gcp terraform node does_not_exist
SEARCH:  [ 'gcp', 'terraform', 'node', 'does_not_exist' ]
getKeywordId :: does_not_exist :: Request failed with status code 404
```

