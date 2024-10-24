import React from 'react';

const StatusBar = () => {
  const [time, setTime] = React.useState(new Date().toLocaleTimeString());
  const [batteryLevel, setBatteryLevel] = React.useState(100);
  const [networkStatus, setNetworkStatus] = React.useState("4G");
  const [signalStrength, setSignalStrength] = React.useState("Full");

  // Update time every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate battery and network status for demonstration
  React.useEffect(() => {
    // Placeholder for Battery Status API
    const battery = navigator.getBattery ? navigator.getBattery() : Promise.resolve({ level: 1 });
    battery.then(bat => setBatteryLevel(Math.round(bat.level * 100)));

    // Simulate network status
    const updateNetworkStatus = () => setNetworkStatus(navigator.onLine ? "4G" : "No Connection");
    updateNetworkStatus(); // Set initial status
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, []);

  // Simulate signal strength changes every 5 seconds
  React.useEffect(() => {
    const signalStrengthLevels = ["No Signal", "Weak", "Fair", "Good", "Full"];
    
    const updateSignalStrength = () => {
      const randomIndex = Math.floor(Math.random() * signalStrengthLevels.length);
      setSignalStrength(signalStrengthLevels[randomIndex]);
    };

    const signalInterval = setInterval(updateSignalStrength, 5000);
    return () => clearInterval(signalInterval);
  }, []);

  return (
    <>
  <div className="bg-gray-800 text-white p-2 flex justify-between items-center text-sm fixed top-0 w-full z-10">
  <span className="px-0.5 md:hidden">{time}</span>
  <div className="flex items-center mr-16 md:hidden">
  <span className="px-1">{networkStatus}</span> 
  <span className="px-1">🔋 {batteryLevel}%</span>
  <span className="px-1">📶 </span>
</div>

</div>

  </>
  );
};

export default StatusBar;
