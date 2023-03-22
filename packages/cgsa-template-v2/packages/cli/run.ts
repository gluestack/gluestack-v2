import { join } from 'path';
import { execSync } from 'child_process';

// run:service website -p docker --ports 9001:3000
export const run = (command: string): Promise<void> => {
	const path = join(process.cwd(), '.glue/seal/scripts');

	return new Promise((resolve, reject) => {
		execSync(command, { cwd: path, stdio: 'inherit' });
	});
};
