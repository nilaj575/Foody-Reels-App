import React from "react";
import Reels from '../../components/Reels';

const sampleVideos = [
    { id: 'v1', src: 'https://ik.imagekit.io/uk95uyoyn/89eff195-b60a-4a43-b996-e545f6cde12a_pH6Nion5Y', storeUrl: 'https://example.com/shop/1', description: 'Fresh homemade samosas available at our shop!' },
    { id: 'v2', src: '/assets/sample2.mp4', storeUrl: 'https://example.com/shop/2', description: 'Taste the best biryani in town — limited time offer.' },
    { id: 'v3', src: '/assets/sample3.mp4', storeUrl: 'https://example.com/shop/3', description: 'Homestyle curries made with love. Visit our store.' }
];

const Home = () => {
    return (
        <div style={{ height: '100vh' }}>
            <Reels />
        </div>
    );
};

export default Home;