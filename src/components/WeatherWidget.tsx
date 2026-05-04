import React, { useEffect, useState } from 'react';
import { Cloud, CloudRain, Sun, CloudFog, Zap, Snowflake } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';

interface WeatherWidgetProps {
  cityName: string;
  enCityName: string;
  isEn: boolean;
}

const getWeatherIcon = (code: number, props: any) => {
  if (code <= 3) return <Sun {...props} className={"text-amber-300 " + props.className} />;
  if (code >= 45 && code <= 48) return <CloudFog {...props} className={"text-gray-300 " + props.className} />;
  if (code >= 51 && code <= 67) return <CloudRain {...props} className={"text-blue-300 " + props.className} />;
  if (code >= 71 && code <= 77) return <Snowflake {...props} className={"text-sky-200 " + props.className} />;
  if (code >= 80 && code <= 82) return <CloudRain {...props} className={"text-blue-400 " + props.className} />;
  if (code >= 95) return <Zap {...props} className={"text-yellow-400 " + props.className} />;
  return <Cloud {...props} className={"text-gray-300 " + props.className} />;
};

const getWeatherDesc = (code: number, isEn: boolean) => {
  if (code === 0) return isEn ? 'Clear' : '晴朗';
  if (code <= 3) return isEn ? 'Partly Cloudy' : '多云';
  if (code >= 45 && code <= 48) return isEn ? 'Fog' : '雾';
  if (code >= 51 && code <= 67) return isEn ? 'Rain' : '雨';
  if (code >= 71 && code <= 77) return isEn ? 'Snow' : '雪';
  if (code >= 80 && code <= 82) return isEn ? 'Showers' : '阵雨';
  if (code >= 95) return isEn ? 'Thunderstorm' : '雷暴';
  return isEn ? 'Cloudy' : '多云';
};

export default function WeatherWidget({ cityName, enCityName, isEn }: WeatherWidgetProps) {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [timezone, setTimezone] = useState('Asia/Shanghai');

  useEffect(() => {
    let interval: any;
    
    const fetchWeather = async () => {
      try {
        // Fetch coordinates
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(enCityName)}&count=1`);
        const geoData = await geoRes.json();
        
        if (!geoData.results || geoData.results.length === 0) return;
        const { latitude, longitude, timezone: tz } = geoData.results[0];
        if (tz) setTimezone(tz);

        // Fetch weather
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
        const weatherData = await weatherRes.json();
        setWeather(weatherData);

      } catch (err) {
        console.error("Error fetching weather:", err);
      }
    };

    fetchWeather();

    const updateTime = () => {
      try {
          const now = new Date();
          const timeString = new Intl.DateTimeFormat('en-US', {
              timeZone: timezone,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
          }).format(now);
          setTimeStr(timeString);

          const dateString = new Intl.DateTimeFormat(isEn ? 'en-US' : 'zh-CN', {
              timeZone: timezone,
              month: 'numeric',
              day: 'numeric',
              weekday: 'short'
          }).format(now);
          setDateStr(dateString);
      } catch (e) {
          // fallback
      }
    };

    updateTime();
    interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [enCityName, timezone, isEn]);

  if (!weather || !weather.daily) {
      return (
          <div className="animate-pulse">
              <div className="h-20 bg-white/10 rounded-xl mb-4"></div>
              <div className="h-24 bg-white/10 rounded-xl mb-4"></div>
              <div className="h-10 bg-white/10 rounded-xl"></div>
          </div>
      );
  }

  const todayTempMin = Math.round(weather.daily.temperature_2m_min[0]);
  const todayTempMax = Math.round(weather.daily.temperature_2m_max[0]);
  const todayCode = weather.daily.weather_code[0];

  return (
    <>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-white/70 font-medium mb-1">{isEn ? enCityName : cityName} {isEn ? 'Current Time' : '当地时间'}</h3>
          <div className="text-4xl font-bold font-mono tracking-tight">{timeStr || '00:00:00'}</div>
          <div className="text-white/60 text-sm mt-1">{dateStr}</div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-white/70 text-sm mb-1">{isEn ? 'Today' : '今日'} • {format(parseISO(weather.daily.time[0]), 'M/d')}</div>
            <div className="text-3xl font-bold">{todayTempMin}~{todayTempMax}°</div>
            <div className="text-white/60 text-xs mt-1">{getWeatherDesc(todayCode, isEn)}</div>
          </div>
          {getWeatherIcon(todayCode, { className: "w-12 h-12" })}
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5 opacity-80 text-center">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <div className="text-xs text-white/50 mb-1">{format(parseISO(weather.daily.time[i]), 'M/d')}</div>
              <div className="text-xs mb-2">
                  {format(parseISO(weather.daily.time[i]), 'EEE', { locale: isEn ? enUS : zhCN })}
              </div>
              {getWeatherIcon(weather.daily.weather_code[i], { className: "w-5 h-5 mx-auto mb-1" })}
              <div className="text-[10px]">
                  {Math.round(weather.daily.temperature_2m_min[i])}~{Math.round(weather.daily.temperature_2m_max[i])}°
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
