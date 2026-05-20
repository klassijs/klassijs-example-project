module.exports = (async () => {
  const mod = await import('klassi-js/runtime/coding-standards/eslint/eslint.config.js');
  const klassiConfig = mod.default ?? mod;

  return [
    ...(Array.isArray(klassiConfig) ? klassiConfig : [klassiConfig]),
    {
      languageOptions: {
        globals: {
          URL: true,
        },
      },
    },
  ];
})();
