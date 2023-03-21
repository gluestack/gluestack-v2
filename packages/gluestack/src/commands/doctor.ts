
import { Command } from 'commander';
import action from '../actions/doctor';

export default async (program: Command) => {
	program
		.command('doctor')
		.description('generates a report of the required tools and their versions')
		.action(action);
};
