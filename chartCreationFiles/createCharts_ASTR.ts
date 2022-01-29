import { ChartJSNodeCanvas, ChartCallback } from 'chartjs-node-canvas';
import { BubbleDataPoint, ChartConfiguration, ChartTypeRegistry, ScatterDataPoint, ChartDataset } from 'chart.js';
import { promises as fs } from 'fs';
import  _  from 'lodash';


interface createConfigurationProps {
	canvasHeight: number,
	canvasWidth: number,
	yLabel: string,
	datasets: ChartDataset<keyof ChartTypeRegistry, (number | ScatterDataPoint | BubbleDataPoint)[]>[],
}
interface resultsType {
	
}
const createConfiguration = ({
	canvasHeight, 
	canvasWidth, 
	yLabel, 
	datasets}:createConfigurationProps):ChartConfiguration => {
	return {
		type: 'bar',
		data: {
			labels: ['1', '2', '3', '4', '5', '6', '7'],
			datasets: datasets
		},
		options: {
			scales: {
				y: {
					title: {
						display: true,
						text: yLabel,
						font: {
							size: 16,
							weight: 'bold'
						}
					},
				},
				x: {
					title: {
						display: true,
						text: 'DEPTH',
						font: {
							size: 16,
							weight: 'bold',
							
						}
					},
					grid: {
						display: false
					}
				}
			}
		},
		plugins: [{
			id: 'background-colour',
			beforeDraw: (chart) => {
				const ctx = chart.ctx;
				ctx.save();
				ctx.fillStyle = '#DDDDDD';
				ctx.fillRect(0, 0, canvasWidth, canvasHeight);
				ctx.restore();
			}
		}]
	}
}

const parseDirectoryWithResults = async(strategy:string, parameters:Array<string>) => {
	let FS = import('fs');
	let counts = [0, 0, 0, 0, 0, 0, 0];
	let results = [];
	for (let i = 0; i < parameters.length; i++) {
		results.push({
			averageLength: [0, 0, 0, 0, 0, 0, 0],
			averageVisitedStates: [0, 0, 0, 0, 0, 0, 0],
			averageProcessedStates: [0, 0, 0, 0, 0, 0, 0],
			averageDepthAchieved: [0, 0, 0, 0, 0, 0, 0],
			averageDuration: [0, 0, 0, 0, 0, 0, 0],
		})
	}
	const files = _.filter((await FS).readdirSync('../413ukladow'), (file) => {return file.includes(strategy) && file.includes("stats")});
	for(let i = 0; i < parameters.length; i++) {
		for(let j = 0; j < files.length; j++) {
			if(files[j].includes(parameters[i])) {
				let file_lines = (await FS).readFileSync('../413ukladow/' + files[j], 'utf-8').split('\n');
				let expected_length = parseInt(files[j].slice(4, 6));
				results[i].averageLength[expected_length - 1] += parseInt(file_lines[0]);
				results[i].averageVisitedStates[expected_length - 1] += parseInt(file_lines[1]);
				results[i].averageProcessedStates[expected_length - 1] += parseInt(file_lines[2]);
				results[i].averageDepthAchieved[expected_length - 1] += parseInt(file_lines[3]);
				results[i].averageDuration[expected_length - 1] += parseFloat(file_lines[4]);
				if (i === 0) counts[expected_length - 1] += 1;
			}
		}
		//Rounding duration to {X}.yy format
		results[i].averageDuration = _.map(results[i].averageDuration, (it) => {return Math.round(it * 100) / 100})
		//Dividing by the number of files of this depth
		results[i].averageLength = _.map(results[i].averageLength, (it, idx) => {return it / counts[idx]})
		results[i].averageVisitedStates = _.map(results[i].averageVisitedStates, (it, idx) => {return it / counts[idx]})
		results[i].averageProcessedStates = _.map(results[i].averageProcessedStates, (it, idx) => {return it / counts[idx]})
		results[i].averageDepthAchieved = _.map(results[i].averageDepthAchieved, (it, idx) => {return it / counts[idx]})
		results[i].averageDuration = _.map(results[i].averageDuration, (it, idx) => {return it / counts[idx]})
	}
	return results;
}



async function main(): Promise<void> {
	const width = 800;
    const height = 500;
	// const height = 900;
	const colors = ["#e60049", "#0bb4ff", "#50e991", "#e6d800", "#9b19f5", "#ffa300", "#dc0ab4", "#b3d4ff", "#00bfa0"];
	const chartCallback: ChartCallback = (ChartJS) => {
		ChartJS.defaults.responsive = true;
		ChartJS.defaults.maintainAspectRatio = false;
	};
	const parameters = ["manh", "hamm"];
	const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });
	const DATA = await parseDirectoryWithResults("astr", parameters);




	//#1. AVERAGE LENGTH OF SOLUTION
	let configuration:ChartConfiguration = createConfiguration({
		canvasHeight: height,
		canvasWidth: width,
		yLabel: 'AVERAGE LENGTH',
		datasets: _.map(parameters, (param, idx) => {
			return {
				label: param.toUpperCase(),
				data: DATA[idx].averageLength,
				backgroundColor: colors[idx]
			}
		})
	});
	let buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
	await fs.writeFile('./astr_AVERAGE_LENGTH.png', buffer, 'base64');


	//#2. AVERAGE VISITED STATES
	configuration = createConfiguration({
		canvasHeight: height,
		canvasWidth: width,
		yLabel: 'AVERAGE VISITED STATES',
		datasets: _.map(parameters, (param, idx) => {
			return {
				label: param.toUpperCase(),
				data: DATA[idx].averageVisitedStates,
				backgroundColor: colors[idx]
			}
		})
	});
	buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
	await fs.writeFile('./astr_AVERAGE_VISITED_STATES.png', buffer, 'base64');

	//#3. AVERAGE PROCESSED STATES
	configuration = createConfiguration({
		canvasHeight: height,
		canvasWidth: width,
		yLabel: 'AVERAGE PROCESSED STATES',
		datasets: _.map(parameters, (param, idx) => {
			return {
				label: param.toUpperCase(),
				data: DATA[idx].averageProcessedStates,
				backgroundColor: colors[idx]
			}
		})
	});
	buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
	await fs.writeFile('./astr_AVERAGE_PROCESSED_STATES.png', buffer, 'base64');

	//#4. AVERAGE DEPTH ACHIEVED
	configuration = createConfiguration({
		canvasHeight: height,
		canvasWidth: width,
		yLabel: 'AVERAGE DEPTH ACHIEVED',
		datasets: _.map(parameters, (param, idx) => {
			return {
				label: param.toUpperCase(),
				data: DATA[idx].averageDepthAchieved,
				backgroundColor: colors[idx]
			}
		})
	});
	buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
	await fs.writeFile('./astr_AVERAGE_DEPTH_ACHIEVED.png', buffer, 'base64');

	//#5. AVERAGE DEPTH ACHIEVED
	configuration = createConfiguration({
		canvasHeight: height,
		canvasWidth: width,
		yLabel: 'AVERAGE SOLVING DURATION [ms]',
		datasets: _.map(parameters, (param, idx) => {
			return {
				label: param.toUpperCase(),
				data: DATA[idx].averageDuration,
				backgroundColor: colors[idx]
			}
		})
	});
	buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
	await fs.writeFile('./astr_AVERAGE_SOLVING_DURATION.png', buffer, 'base64');
}
main();