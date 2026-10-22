import tseslint from 'typescript-eslint';
export default tseslint.config({ignores:['dist/**','src-tauri/**','node_modules/**','src/domain/generated/**','test-results/**','design/**']},...tseslint.configs.recommended,{files:['**/*.{ts,tsx}'],rules:{'@typescript-eslint/no-unused-vars':['error',{argsIgnorePattern:'^_',varsIgnorePattern:'^_'}],'@typescript-eslint/no-explicit-any':'error'}});
