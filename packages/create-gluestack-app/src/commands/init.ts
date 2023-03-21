
import { Command } from 'commander';
import action from '../actions/init';

export default async (program: Command) => {
	program
		.command('init')
		.description('installs the gluestack boilerplate')
		.argument('<directory-name>', 'directory name of the boilerplate')
		.argument('[template]', 'name of the template', 'cgsa-template-v2')
		.action(action);
};
