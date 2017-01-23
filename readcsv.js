#!/usr/bin/env node

const fs = require('fs'),
	http = require('http'),
	URL_FILE = 'http://addialeto.net/dashboard/teste/poli-piegraph-mar15.csv',
	fileExt = URL_FILE.split('.').pop(),
	FILE_NAME = 'csvfile.' + fileExt,
	csvWriter = require('csv-write-stream')
	

http.get(URL_FILE, (response) => {
	response
		.on('data', (buffer) => {
			//console.log(buffer.toString('utf-8'))

			parseStream(buffer.toString('utf-8').toLowerCase().split(/\n/g))
		})
		.on('error', error => console.error(error))

	!response && console.log("houve um erro na requisição do arquivo")

	//console.warn(`Arquivo salvo em ${__dirname}\\${FILE_NAME}`)
})
const normalizeString = e => {
	return e.replace(/\é|\ê/g, 'e')
			.replace(/\í/g, 'i')
			.replace(/\á|\ã/g, 'a')
			.replace(/\ó|\ô/g, 'o')
			.replace(/\^/g, '')
			.replace(/\s/g, '-')
}
const parseStream = file =>{
	if(file) {
		let [rows, titles] = [[], []]

		file.map((e, index) => {
			if(0 !== index) {
				let cols = e.split(',')

				//console.log(cols)

				let origemAlias = cols[0], 
					origem = normalizeString(origemAlias)

				rows.push({
					'origemAlias': origemAlias,
					'origem': origem, 
					'receita' : parseFloat(cols[2])
				})
			}
		})

		rows.map((item, index) => {
			if(-1 === titles.indexOf(item['origem'])) titles.push(item['origem'])
		})

		let writer = csvWriter({headers: ['Origem', 'Receita']})
		writer.pipe(fs.createWriteStream(FILE_NAME))

		titles.map((title, indexTitle) =>{
			let sum = 0

			rows.map((row, indexRow) => {
				if(title === row['origem']) {
					sum += row['receita']

					//console.log(row['origemAlias'])
					
					writer.write([row['origemAlias'], sum.toFixed(2).toString()])
				}
			})
		})

		writer.end()
	}
}