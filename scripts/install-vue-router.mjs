import { execSync } from 'child_process'

console.log('Installing vue-router...')
execSync('pnpm add vue-router@^4.5.0', {
  cwd: '/vercel/share/v0-project',
  stdio: 'inherit',
})
console.log('Done.')
