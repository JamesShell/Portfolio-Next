import withTM from 'next-transpile-modules';

// Add the 'maath' package to the list of modules to be transpiled
const nextConfig = withTM(['maath'])({
  reactStrictMode: true,
});

export default nextConfig;
