import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Required for the multi-stage Docker build (copies only the minimal runtime)
	output: "standalone",

	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "m.media-amazon.com",
				port: "",
				pathname: "/images/**",
			},
			{
				protocol: "https",
				hostname: "ia.media-imdb.com",
				port: "",
				pathname: "/images/**",
			},
			{
				protocol: "https",
				hostname: "images-na.ssl-images-amazon.com",
				port: "",
				pathname: "/images/**",
			},
			{
				protocol: "https",
				hostname: "via.placeholder.com",
				port: "",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
