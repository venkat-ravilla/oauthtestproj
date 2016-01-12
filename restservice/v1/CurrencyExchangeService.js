/**
 * @author venkat
 */
exports.CurrencyExchangeService={
	currencyRate:function(callback){
		var fromcurrency=this.param('from','USD'),
		tocurrency=this.param('to','INR')
		this.externalApiCall('http://rate-exchange.appspot.com/currency','GET',{
			from:fromcurrency,
			to:tocurrency
		},function(result){
			callback(result)
		})
	}
}
