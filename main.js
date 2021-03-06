//Function used to check if browser supports the window.console
		const cons = consoleCall => !!window.console && consoleCall

		const normalizeString = str => {
			return str.replace(/\s/g, '-')
					.replace(/\*/g, '')
					.replace(/\ô|\ó/gi, 'o')
					.replace(/\â|\ã|\á/g , 'a')
					.replace(/\ê|\é/g , 'e')
					.replace(/\í/g , 'i')
		}
		
		
		(function() {
			let [rows, cols, group, pieDataTotal, visitTotal, receptTotal, colors, indexColor] = [
				[], [], [], [], [], [], Highcharts.getOptions().colors, 0
			];


			const [fileUrl, data, splitRegex] = [
				'http//addialeto.net/dashboard/teste/jsonp.php', 
				{'filename': 'poli-piegraph-mar15.csv'}, 
				{ rows: /\n/g, cols: /\,/g}
			],
			ajaxHandler = {
				success: e => cons(console.warn(e)),
				error: e => cons(console.error(`Houve um erro ${e}`))
			}

			jQuery.support.cors = true;
			jQuery.ajax({
				method 			: 'GET',
				dataType 		: 'jsonp',
				url 			: fileUrl,
				data: data,
				error 			: ajaxHandler.error,
				success 		: (e) => {
					if(undefined !== raw) {
					raw.toLowerCase().split(splitRegex.rows).map((r, indexRaw) => {
						//cons(console.log(indexRaw, r))
						if(0 !== indexRaw) { //Removing the header row
							let col 		= r.split(splitRegex.cols)

							//Chaining the replaces to remove the accents and blank spaces
							let origem 		= normalizeString(col[0])

							let aliasMidia 	= col[1]

							//Chaining the replaces to remove the accents and blank spaces
							let midia 		= normalizeString(aliasMidia)
							
							let receita 	= parseFloat(col[2])//.toFixed(2)
							let visita 		= parseInt(col[3])

							rows.push({
								'origem' 		: origem,
								'midia' 		: midia,
								'aliasMidia' 	: aliasMidia,
								'receita' 		: receita,
								'visita' 		: visita
							})
						}
					})

					rows.map((item, index) => {
						//cons(console.log({name: item['aliasMidia'], y: item['receita']}))
						indexColor++
						pieDataTotal.push({name: item['origem'], y: item['receita']})


						if(-1 === group.indexOf(item['origem'])) {
							group.push(item['origem'])
						}
					})

					group.map((g, index) => {
						let [visitSum, receptSum] = [0, 0]
						
						visitTotal[g] 	= 0
						receptTotal[g] 	= 0
						
						rows.map((item, index) => {
							//cons(console.log(index, item))
							if(g === item['origem']) {
								receptSum += item['receita']
								//cons(console.log(receptSum, item['receita']))
								receptTotal[g] 	= {y: parseFloat(receptSum.toFixed(2)), name: item['aliasMidia']}

								visitSum 		+= item['visita']

								visitTotal[g] 	= {y: visitSum, name: item['aliasMidia']}
							}
						})
						//cons(console.log('Final RESULT: ', receptTotal, visitTotal))
					})

					let pieData = {
						receita 	: [], 
						visitas 	: []
					}

					
					for(let i in visitTotal) {
						indexColor++
						
						pieData['receita'].push({
							name 	: receptTotal[i]['name'], 
							y 		: receptTotal[i]['y'], 
							color 	: colors[indexColor]
						})

						pieData['visitas'].push({
							name 	: visitTotal[i]['name'], 
							y 		: visitTotal[i]['y'], 
							color 	: colors[indexColor]
						})
					}
					//cons(console.log(pieData))
					

					Highcharts.chart('chart', {
						title: {
							text: 'TESTE'
						},
						chart: {
							type: 'pie'
						},
						plotOptions: {
							pie: {
								shadow: false,
								center: ['50%', '50%']
							}
						},
						series: [
						{
							name: 'Visitas',
							data: pieData['receita'],
							size: '90%',
							innerSize: '75%',
							dataLabels: {
								distance: 150
							}
						},
						{
							name: 'Receita',
							data: pieData['visitas'],
							size: '75%',
							innerSize: '60%',
							dataLabels: {
								distance: 100
							}
						},
						{
							name: 'Total',
							data: pieDataTotal,
							size: '60%',
							dataLabels: {
								distance: 70
							}
						}]
					})


				}

				else cons(console.error(`Houve um erro para trazer os dados do CSV`))
				} //ajaxHandler.success
			})
			.always((raw) =>{
				//cons(console.log(`always => ${raw.split(/\n/g)}`))
				
				
			})
		}())