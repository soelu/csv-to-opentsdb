# power transformer

Takes a CSV file an transforms average power values in the given csv and transforms them in a way that they represent average values.

## Installation

`npm install`

## Usage

```
Example: node transform.js sourceCSV

Options

  -h, --help                       Display this message.                                                         
  -v, --verbose                    Enable verbose Logging                                                        
  --debug                          Enable debug output in CSV                                                    
  --files string[]                 Can also be provided as the last two arguments without a parameter name. The  
                                   parameter takes up to two arguments: 1st argument is interpreted as source    
                                   CSV file path. The 2nd one is optinal an is interpreted as destination CSV    
                                   file. If no second file path is given the destination file wil have a         
                                   '_transformed' added to the original filename.                                
  -f, --dateFormat string          Default: 'DD.MM.YYYY'. For details see                                        
                                   http://momentjs.com/docs/#/parsing/string-format/                             
  --dateColumn string              The name of the column in the source file that holds the date. Default:       
                                   'Datum'                                                                       
  -t, --timeFormat string          Default: 'hh:mm'. For details see http://momentjs.com/docs/#/parsing/string-  
                                   format/                                                                       
  --timeColumn string              The name of the column in the source file that holds the time. Default:       
                                   'Uhrzeit'                                                                     
  -p, --sourcePowerColumn string   The name of the column in the source file that holds the power value.         
                                   Default: 'Wert in KW'                                                         
  -o, --destPowerColumn string     The name of the column in the destination file that will hold the power       
                                   value. Default: 'PowerConsumed'                                               
  --copyPowerColumns string[]      An optinal list of column names that will have copies of the powe value.      
  -w, --calculateWork              If given, work values will be calculated for each power value as counter      
                                   starting at 0.                                                                
  -u, --isUTCTimestamp             If given, the source file is expected to have a column 'Timestamp' that holds 
                                   a UTC timstamp. All date and time format options will be ignored.             
  -m, --powerMultiplier number     The number that the source value needs to be multiplied with to get W. So if  
                                   the the source is in kW the multiplier needs to be 1000. Default: 1000        
```


## Licence

MIT