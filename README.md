# csv to opentsdb importer

Takes a CSV file and puts the numeric values tagged in a running OpenTSDB instance.

## Installation

`npm install`

## Usage

```
Example:  node main.js -v --tags guid=foo_guid -d ',' bar.csv

Options

  -h, --help                  Display this message.                                                         
  -v, --verbose               Enable verbose Logging                                                        
  --file string               Can also be provided as the last argument without a parameter name. The       
                              parameter is interpreted as source CSV file path.                             
  -t, --tsColumn string       The name of the column in the source file that holds the time. Default:       
                              'Timestamp'                                                                   
  -d, --delimiter string      The String the delimits two columns. Default: ';'                             
  -u, --opentsdb-url string   The full URL to the OpenTSDB instance. Default: '127.0.0.1:4242'              
  --tags string[]             A List of a tags to be added to each metric. Format Example: 'guid=asdf-123   
                              user=test_user5'   
```

## Hint
Imports are done via socket connect. So the writes are asynchronous and success messages can arrive after the csv is parsed and send completely. 

## Example

### Setup
To create a full running local setup setup use this [repo](https://github.com/soeren-lubitz/opentsdb-grafana-docker) 

### Create a CSV-File in form:
```
	Timestamp,Foo,Bar
	1483342774,42.1,23.2
	1483342784,142.1,213.2
```

### Import the CSV-File:

	node main.js --tags some_csv_wide_tag=some_csv_wide_tag_value -d ',' example.csv	

## License

MIT