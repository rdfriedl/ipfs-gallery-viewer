import React, { useContext, useEffect, useMemo } from 'react';
// import IPFS from 'ipfs';
// import ipfsHttpClient from 'https://unpkg.com/ipfs-http-client';
import { useAsync } from 'react-use';
import { useAppSettings } from './AppSettingsProvider';

export const IpfsContext = React.createContext();

export const useIpfs = () => useContext(IpfsContext);

export const IpfsProvider = ({ children, repo }) => {
	const { ipfsMode, apiUrl } = useAppSettings();

	const state = useAsync( async () => {
		if( ipfsMode === 'remote' && apiUrl ) {
			await import('https://unpkg.com/ipfs-http-client@49/dist/index.min.js');

			console.info('connecting to remote node');
			const client = await IpfsHttpClient({url: apiUrl});

			const {id} = await client.id();
			console.log(`connected to ${id}`);

			return client;
		}
		else if(ipfsMode === 'local'){
			await import('https://unpkg.com/ipfs@0.54.4/dist/index.min.js');
			console.info('starting local node');

			const client = await Ipfs.create({
				start: true,
				repo,
				preload: {
					enabled: true
				}
			});

			const { id } = await client.id();
			console.log(`ipfs node id ${id}`);

			return client;
		}
		else {
			return null;
		}
	}, [repo, apiUrl, ipfsMode]);

	const context = useMemo(() => ({
		error: state.error,
		loading: state.loading,
		ipfs: state.value
	}), [state]);

	useEffect(() => {
		if(!context.loading && window.ipfs !== context.ipfs){
			window.ipfs = context.ipfs;
		}
	}, [context]);

	return (
		<IpfsContext.Provider value={context}>
			{children}
		</IpfsContext.Provider>
	)
}
