import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

export default function TeamMembersTable() {
  const [sheetTitles, setSheetTitles] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [scriptTitles, setScriptTitles] = useState([]);
  const [sheet, setSheet] = useState([]);
  const [columns, setColumns] = useState([])
  const [leadSheet, setLeadSheet] = useState('')
  const [callerId, setCallerId] = useState('');
  const [attendant, setAttendant] = useState('');
  const [index, setIndex] = useState('');
  const [active, setActive] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [sheetId, setSheetId] = useState('');
  const [didId, setDidId] = useState('');
  const [scriptId, setScriptId] = useState('');
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollTo, setScrollTo] = useState('');
  const [nextLead, setNextLead] = useState('');
  const highlightedRowRef = useRef(null);
  const navigate = useNavigate()
  const location = useLocation();

  // useEffect(() => {
  //   if (isStarted && highlightedRowRef.current) {
  //     highlightedRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  //   }
  // }, [isStarted]);
  useEffect(() => {
    if (isStarted && highlightedRowRef.current) {
      highlightedRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isStarted, scrollTo]);

  useEffect(() => {
    const getResources = async () => {
      const response = await fetch('https://localhost:8080/resources', { credentials: 'include' });
     
      if (response.status == 401) {
        return navigate('/login')
      }
      
      if (response.ok) {
        const { resources, ongoing_campaign } = await response.json();
        const fallback = [];

        setSheetTitles(resources[0] || fallback);
        // setNumbers(resources[1] || fallback);
        setScriptTitles(resources[1] || fallback);

        if (ongoing_campaign) {
          const sheet_id = ongoing_campaign[0];
          const campaign_start = ongoing_campaign[1]
          const call_status_report = ongoing_campaign[2];

          // const scroll_to = parseInt(campaign_start) + parseInt(call_status_report.length)
          // setScrollTo(scroll_to);

          if (window.socket?.readyState !== 1) {
            window.socket = new WebSocket('wss://localhost:8080');

            window.socket.onopen = () => {
              console.log('Welcome back, you\'re connected.');
            }
          }

          const keys = Object.keys(call_status_report);
          const call_status_arr = [];

          keys.sort((a, b) => a - b); // Sort in ascending order

          // console.log(call_status_report)

          if (keys.length > 0) {
            for (let key of keys) {
              call_status_arr.push(call_status_report[key]);
              
              const next_key = +key + 1;

              // if (call_status_report[next_key] === undefined && next_key < +keys[keys.length - 1]) {
              //   // console.log({key: +key + 1, status: 'unknown'})
              //   call_status_arr.push('unknown');
              // }

              for (let i = next_key; i < +keys[keys.length - 1]; i++) {
                if (call_status_report[i] !== undefined) break
                call_status_arr.push('unknown');
              }
            }
          }

          const scroll_to = parseInt(campaign_start) + parseInt(call_status_arr.length)
          setScrollTo(scroll_to);

          console.log(scroll_to);

          setNextLead(scroll_to);

          fetchSheet(sheet_id, call_status_arr, campaign_start)
          .then(result => {
            if (!result) return

            window.socket.onmessage = (message) => {
              message = JSON.parse(message.data);
              updateCallStatus(message.sheet_index, message.status);
            }

            setIsStarted(true);
            // setIsPaused(false);
            // setIsPaused(true);
          })
        }
      }
    }

    getResources()
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < 768) {
        setIsMobile(true);
      } else if (width >= 768 && width <= 1024) {
        setIsMobile(false);
      }
    }
    handleResize()
  }, []);

  async function fetchSheet(id, call_status_report, campaign_start) {
    if (!id) {
      setSheet([]);
      setColumns([]);
      return
    }

    const response = await fetch(`https://localhost:8080/sheets/${id}`, { credentials: 'include' });

    if (response.status == 401) {
      return navigate('/login')
    }

    const sheet = await response.json();
    if (response.ok) {
      setSheet(sheet);
      setColumns(Object.keys(sheet[0]));

      if (call_status_report?.length) {
        setSheet(prev => prev.map((row, i) => {
          let status = '';

          // if (!checkNumberValidity(row['Telephone']) && call_status_report.length && i >= campaign_start) {
          //   status = 'invalid number'
          // }
          if (call_status_report.length && i >= campaign_start) {
            status = call_status_report.shift();
          }

          return {...row, status}
        }));
      }

      return true
    }
  }

  function updateCallStatus(index, status) {
    console.log({index, status})
    
    if (['no answer', 'ended', 'invalid number', 'failed'].includes(status)) {
      // setIndex(+index + 1)
      // const last_value = arr_copy[arr_copy.length - 1];
      // console.log('Before splice:', arr_copy);
      // arr_copy.splice(arr_copy.indexOf(+index), 1); // Get the positional index of the value and remove. This unhighlights the corresponding row.
      // console.log('After splice:', arr_copy);
      // arr_copy.push(arr_copy[arr_copy.length - 1] + 1); // Increment the last item in the array so the highlight can move one row down
      // arr_copy.push(last_value + 1); // Increment the last item in the array so the highlight can move one row down
      // console.log('After update:', arr_copy);
      // setActive(arr_copy);

      setActive(prev => {
        const arr_copy = prev;

        const last_value = arr_copy[arr_copy.length - 1];
        // console.log('Before splice:', arr_copy);
        arr_copy.splice(arr_copy.indexOf(+index), 1); // Get the positional index of the value and remove. This unhighlights the corresponding row.
        // console.log('After splice:', arr_copy);
        // arr_copy.push(arr_copy[arr_copy.length - 1] + 1); // Increment the last item in the array so the highlight can move one row down
        arr_copy.push(last_value + 1); // Increment the last item in the array so the highlight can move one row down
        // console.log('After update:', arr_copy);

        return arr_copy
      });

      setScrollTo(index + 1)
    };
    
    setSheet(prev => prev.map((row, i) => {
      if (status == 'ended') status = row.status;
  
      if (i == index) {
        // if (!checkNumberValidity(row['Telephone'])) status = 'failed';
        return {...row, status}
      }
      else {
        return row
      }
    }))
  }

  // const isFormValid = leadSheet !== '' && leadSheet !== 'Select Calling List' &&
  //                      callerId !== '' && callerId !== 'Select Caller Id' && 
  //                      attendant !== '' && attendant !== 'Select Attendant' && 
  //                      index !== '' && index >= 0 && index <= sheet.length - 1;
  const isFormValid = leadSheet !== '' && leadSheet !== 'Select Calling List' &&
                       attendant !== '' && attendant !== 'Select Attendant' && 
                       index !== '' && index >= 0 && index <= sheet.length - 1;

  const handleStart = async () => {
    if (!isFormValid) return

    let i = parseInt(index);
    if (i >= 0) {
      const arr = [i, i + 1, i + 2];

      setActive(arr);
    }

    if (window.socket?.readyState !== 1) {
      console.log('Not connected, working on it...................')
      window.socket = new WebSocket('wss://localhost:8080');

      window.socket.onopen = async () => {
        console.log('You are connected.');

        fetch(`https://localhost:8080/dialer/start`, { 
          credentials: 'include',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sheet_id: sheetId, script_id: scriptId, caller_id: didId, start: index })
        })
        .then(response => {
          if (!response.ok) return
          
          setIsStarted(true);
          setIsPaused(false);
        });
      }
    }
    else {
      console.log('Already connected, fetching...............');
      fetch(`https://localhost:8080/dialer/start`, { 
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sheet_id: sheetId, script_id: scriptId, caller_id: didId, start: index })
      })
      .then(response => {
          if (!response.ok) return
          
          setIsStarted(true);
          setIsPaused(false);
      });
    }

    window.socket.onmessage = (message) => {
      message = JSON.parse(message.data);
      updateCallStatus(message.sheet_index, message.status);
    }
  }

  const handleStopClick = () => {
    setShowStopConfirm(true);
  };

  const confirmStop = () => {
    setIsStarted(false);
    setIsPaused(true);

    setSheet([]);
    setIndex('');
    setActive([]);
    setCallerId('');
    setLeadSheet('');
    setAttendant('');

    setShowStopConfirm(false);

    fetch('https://localhost:8080/dialer/stop', {method: 'POST', credentials: 'include'});
  };

  const cancelStop = () => {
    setShowStopConfirm(false);
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'answered':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'no answer':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'busy':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'queued':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'ringing':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'invalid number':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'unknown':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default:
        return 'invisible'
    }
  };

  // function checkNumberValidity(tel) {
  //   if (!tel) return false
    
  //   tel = tel.toString();
  //   if (/^\+1\d{10}$/.test(tel)) return true;

  //   tel = tel.replaceAll(/\D/g, '');
  //   tel = (tel[0] == 1) ? tel : '1' + tel
    
  //   if (tel.length === 11) {
  //     return true
  //   }
  //   else {
  //     return false
  //   }
  // }

  const formatPhoneNumber = (value) => {
    const digitsOnly = value.replace(/\D/g, '');
    
    if (digitsOnly.length === 0) return '';
    if (digitsOnly.length <= 1) return `+${digitsOnly}`;
    if (digitsOnly.length <= 4) return `+${digitsOnly[0]} (${digitsOnly.slice(1)}`;
    if (digitsOnly.length <= 7) return `+${digitsOnly[0]} (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4)}`;
    return `+${digitsOnly[0]} (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7, 11)}`;
  };

  return (
    <div className="w-full p-4 md:p-8 flex flex-col relative" style={{ 
      backgroundColor: '#0a0a0b', 
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', 
      height: '100vh',
    }}>
      {/* Stop Confirmation Dialog */}
      {showStopConfirm && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="rounded-xl p-6 max-w-md w-full mx-4 border" style={{
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(10px)',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}>
            <h3 className="text-white text-lg font-semibold mb-3" style={{letterSpacing: '-0.01em'}}>Stop Campaign?</h3>
            <p className="text-sm mb-6" style={{color: '#a1a1aa'}}>
              Are you sure you want to stop this campaign? All progress will be lost and you'll need to restart from the beginning.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelStop}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                style={{background: 'rgba(255, 255, 255, 0.06)'}}
                onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.08)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.06)'}
              >
                Cancel
              </button>
              <button
                onClick={confirmStop}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: 'rgb(217, 119, 87)' }}
                onMouseOver={(e) => e.target.style.opacity = '0.9'}
                onMouseOut={(e) => e.target.style.opacity = '1'}
              >
                Stop Campaign
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Control Panel */}
      {!isStarted && (
        <div className="mb-8 w-full md:w-[85%] lg:w-[75%] xl:w-[70%] mx-auto">
          {/* Mobile: Card-based layout */}
          <div className="md:hidden rounded-xl p-5 space-y-4" style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            marginTop: (isMobile) ? '60px' : '0'
          }}>
            {/* Campaign Settings Header */}
            <div className="pb-3 border-b" style={{borderColor: 'rgba(255, 255, 255, 0.05)'}}>
              <h2 className="text-white font-semibold text-base" style={{letterSpacing: '-0.01em'}}>Campaign Settings</h2>
              <p className="text-xs mt-1" style={{color: '#71717a'}}>Configure your campaign parameters</p>
            </div>

            {/* Main Configuration */}
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-white text-sm mb-2 font-semibold" style={{letterSpacing: '-0.01em'}}>Calling List</label>
                <select 
                  className="bg-transparent text-white px-3 py-3 rounded-lg text-sm focus:outline-none cursor-pointer transition-all" 
                  style={{ 
                    colorScheme: 'dark',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                  value={leadSheet}
                  onChange={(e) => {
                    setLeadSheet(e.target.value);
                    const [option] = e.target.selectedOptions;
                    const sheet_id = option.id?.replaceAll(/\D/g, '');
                    setSheetId(sheet_id);
                    fetchSheet(sheet_id)
                  }}
                >
                  <option style={{ backgroundColor: '#18181b' }}>Select Calling List</option>
                  {sheetTitles.map((sheet) => {
                    return (
                      <option key={sheet.id} style={{ backgroundColor: '#18181b' }} id={`sheet-${sheet.id}`}>
                        {sheet.title}
                      </option>
                    );
                  })}
                </select>
              </div>
              
              {/* <div className="flex flex-col">
                <label className="text-white text-sm mb-2 font-semibold" style={{letterSpacing: '-0.01em'}}>Caller Id</label>
                <select 
                  className="bg-transparent text-white px-3 py-3 rounded-lg text-sm focus:outline-none cursor-pointer transition-all" 
                  style={{ 
                    colorScheme: 'dark',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                  value={callerId}
                  onChange={(e) => {
                    setCallerId(e.target.value);
                    const [option] = e.target.selectedOptions;
                    setDidId(option.id?.replaceAll(/\D/g, ''));
                  }}
                >
                  <option style={{ backgroundColor: '#18181b' }}>Select Caller Id</option>
                  {
                    numbers.map((number) => {
                      return (
                        <option key={number.id} style={{ backgroundColor: '#18181b' }} id={`number-${number.id}`}>{formatPhoneNumber(number.phone_number)}</option>
                      );
                    })
                  }
                </select>
              </div> */}
              
              <div className="flex flex-col">
                <label className="text-white text-sm mb-2 font-semibold" style={{letterSpacing: '-0.01em'}}>Automated Attendant</label>
                <select 
                  className="bg-transparent text-white px-3 py-3 rounded-lg text-sm focus:outline-none cursor-pointer transition-all" 
                  style={{ 
                    colorScheme: 'dark',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                  value={attendant}
                  onChange={(e) => {
                    setAttendant(e.target.value);
                    const [option] = e.target.selectedOptions;
                    setScriptId(option.id?.replaceAll(/\D/g, ''));
                  }}
                >
                  <option style={{ backgroundColor: '#18181b' }}>Select Attendant</option>
                  {
                    scriptTitles.map((title) => {
                      return (
                        <option key={title.id} style={{ backgroundColor: '#18181b' }} id={`script-${title.id}`}>{title.title}</option>
                      );
                    })
                  }
                </select>
              </div>
              
              <div className="flex flex-col">
                <label className="text-white text-sm mb-2 font-semibold" style={{letterSpacing: '-0.01em'}}>Start Index</label>
                <input 
                  type="number" 
                  placeholder="0"
                  className="bg-transparent text-white px-3 py-3 rounded-lg text-sm focus:outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                  value={index}
                  onChange={(e) => setIndex(e.target.value)}
                />
              </div>
            </div>

            {/* Action Button */}
            <button 
              className="w-full px-6 py-3.5 rounded-lg font-semibold transition-all text-white disabled:opacity-40 disabled:cursor-not-allowed text-base shadow-lg" 
              style={{ 
                backgroundColor: 'rgb(217, 119, 87)',
                letterSpacing: '-0.01em',
                boxShadow: isFormValid ? '0 0 20px rgba(255, 68, 68, 0.3)' : 'none'
              }} 
              onMouseOver={(e) => !e.target.disabled && (e.target.style.transform = 'scale(1.02)')} 
              onMouseOut={(e) => !e.target.disabled && (e.target.style.transform = 'scale(1)')}
              disabled={!isFormValid}
              onClick={handleStart}
            >
              Start Campaign
            </button>
          </div>

          {/* Desktop: Horizontal layout */}
          <div className="hidden md:flex md:flex-row md:items-end gap-4">
            <div className="flex flex-col flex-1">
              <label className="text-white text-sm mb-2 font-semibold" style={{letterSpacing: '-0.01em'}}>Calling List</label>
              <select 
                className="bg-transparent text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none cursor-pointer transition-all" 
                style={{ 
                  colorScheme: 'dark',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                value={leadSheet}
                onChange={(e) => {
                  setLeadSheet(e.target.value);
                  const [option] = e.target.selectedOptions;
                  const sheet_id = option.id?.replaceAll(/\D/g, '');
                  setSheetId(sheet_id);
                  fetchSheet(sheet_id)
                }}
              >
                <option style={{ backgroundColor: '#18181b' }}>Select Calling List</option>
                {sheetTitles.map((sheet) => {
                  return (
                    <option key={sheet.id} style={{ backgroundColor: '#18181b' }} id={`sheet-${sheet.id}`}>
                      {sheet.title}
                    </option>
                  );
                })}
              </select>
            </div>
            
            {/* <div className="flex flex-col flex-1">
              <label className="text-white text-sm mb-2 font-semibold" style={{letterSpacing: '-0.01em'}}>Caller Id</label>
              <select 
                className="bg-transparent text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none cursor-pointer transition-all" 
                style={{ 
                  colorScheme: 'dark',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                value={callerId}
                onChange={(e) => {
                  setCallerId(e.target.value);
                  const [option] = e.target.selectedOptions;
                  setDidId(option.id?.replaceAll(/\D/g, ''));
                }}
              >
                <option style={{ backgroundColor: '#18181b' }}>Select Caller Id</option>
                {
                  numbers.map((number) => {
                    return (
                      <option key={number.id} style={{ backgroundColor: '#18181b' }} id={`number-${number.id}`}>{formatPhoneNumber(number.phone_number)}</option>
                    );
                  })
                }
              </select>
            </div> */}
            
            <div className="flex flex-col flex-1">
              <label className="text-white text-sm mb-2 font-semibold" style={{letterSpacing: '-0.01em'}}>Automated Attendant</label>
              <select 
                className="bg-transparent text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none cursor-pointer transition-all" 
                style={{ 
                  colorScheme: 'dark',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                value={attendant}
                onChange={(e) => {
                  setAttendant(e.target.value);
                  const [option] = e.target.selectedOptions;
                  setScriptId(option.id?.replaceAll(/\D/g, ''));
                }}
              >
                <option style={{ backgroundColor: '#18181b' }}>Select Attendant</option>
                {
                  scriptTitles.map((title) => {
                    return (
                      <option key={title.id} style={{ backgroundColor: '#18181b' }} id={`script-${title.id}`}>{title.title}</option>
                    );
                  })
                }
              </select>
            </div>
            
            <div className="flex flex-col" style={{minWidth: '100px'}}>
              <label className="text-white text-sm mb-2 font-semibold" style={{letterSpacing: '-0.01em'}}>Start Index</label>
              <input 
                type="number" 
                placeholder="0"
                className="bg-transparent text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                value={index}
                onChange={(e) => setIndex(e.target.value)}
              />
            </div>
            
            <button 
              className="px-6 py-2.5 rounded-lg font-semibold transition-all text-white disabled:opacity-40 disabled:cursor-not-allowed text-sm" 
              style={{ 
                backgroundColor: 'rgb(217, 119, 87)',
                letterSpacing: '-0.01em'
              }} 
              onMouseOver={(e) => !e.target.disabled && (e.target.style.opacity = '0.9')} 
              onMouseOut={(e) => !e.target.disabled && (e.target.style.opacity = '1')}
              disabled={!isFormValid}
              onClick={handleStart}
            >
              Start
            </button>
          </div>
        </div>
      )}

      {/* Dialing Indicator */}
      {isStarted && (
        <div className="mb-6 flex justify-center items-center gap-4">
          {/* Ringing Phone Icon */}
          <div className={`${isPaused ? '' : 'animate-bounce'}`}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" 
                    fill="none" 
                    stroke="rgb(217, 119, 87)" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"/>
            </svg>
          </div>
          
          {/* Pause/Play Icon */}
          <button 
            className="cursor-pointer transition-opacity relative group" 
            onClick={() => {
              // console.log('isPaused was', isPaused)

              fetch('https://localhost:8080/dialer/toggle', { credentials: 'include', method: 'POST'});

              if (isPaused) {
                // console.log('The dialer is paused... Resuming now!')
                // console.log('Next lead:', nextLead);

                if (nextLead >= 0 && nextLead !== '') {
                  // console.log('Next lead is >= 0')
                  const arr = [nextLead, nextLead + 1, nextLead + 2];
                  
                  setActive(arr);
                  setNextLead('');
                }
                else {
                  // console.log('The else block ran');
                  setActive(prev => prev);
                }
              }

              setIsPaused(!isPaused);
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            {isPaused ? (
              // Play Icon
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5v14l11-7L8 5z" fill="rgb(217, 119, 87)"/>
              </svg>
            ) : (
              // Pause Icon
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="4" width="4" height="16" rx="1" fill="rgb(217, 119, 87)"/>
                <rect x="14" y="4" width="4" height="16" rx="1" fill="rgb(217, 119, 87)"/>
              </svg>
            )}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap" style={{background: '#18181b', border: '1px solid rgba(255, 255, 255, 0.1)'}}>
              {isPaused ? 'Resume campaign' : 'Pause campaign'}
            </span>
          </button>
          
          {/* Stop Icon */}
          <button 
            className="cursor-pointer transition-opacity relative group" 
            onClick={handleStopClick}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="5" width="14" height="14" rx="2" fill="rgb(217, 119, 87)"/>
            </svg>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap" style={{background: '#18181b', border: '1px solid rgba(255, 255, 255, 0.1)'}}>
              Stop campaign
            </span>
          </button>
        </div>
      )}

      {/* Table */}
      {
        sheet.length ? 
        <div style={{ 
          backgroundColor: 'rgba(30, 30, 30, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          maxHeight: '100%'
        }}>
          <style>{`
            .table-row-campaign {
              transition: all 0.2s ease;
            }
            .table-row-campaign:hover {
              background-color: rgba(217, 119, 87, 0.05) !important;
              transform: translateX(4px);
            }
          `}</style>
          <div className="overflow-x-auto" style={{ maxHeight: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ 
                    /*backgroundColor: 'rgba(20, 20, 20, 0.4)'*/
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    backgroundColor: 'rgba(20, 20, 20, 1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                  <th style={{ 
                    padding: '1rem 1.5rem', 
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: 'rgba(255, 255, 255, 0.7)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}>#</th>
                  {
                    columns.map((column) => {
                      return (
                        <th key={column} style={{ 
                          padding: '1rem 1.5rem', 
                          textAlign: 'left',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          color: 'rgba(255, 255, 255, 0.7)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                        }}>{column}</th>
                      );
                    })
                  }
                  <th style={{ 
                    padding: '1rem 1.5rem', 
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: 'rgba(255, 255, 255, 0.7)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}>Call Status</th>
                </tr>
              </thead>
              <tbody>
                {sheet.map((member, idx) => {
                  const isHighlighted = isStarted && active.includes(idx);
                  // const isHighlighted = isStarted && idx >= parseInt(index) && (idx < parseInt(index) + 3);
                  let displayStatus = isHighlighted ? 'queued' : member.status;
                  if (member.status) displayStatus = member.status;
                  
                  const isFirstHighlighted = isHighlighted && idx === parseInt(index);
                  
                  return (
                    <tr 
                      key={idx} 
                      // ref={isFirstHighlighted ? highlightedRowRef : null}
                      ref={(isFirstHighlighted || idx == scrollTo || idx == scrollTo - 1) ? highlightedRowRef : null}
                      className="table-row-campaign"
                      style={{
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        backgroundColor: isHighlighted ? 'rgba(255, 68, 68, 0.08)' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem'}}>{idx}</div>
                      </td>
                      {
                        columns.map((column) => {
                          return (
                            <td key={column} style={{ padding: '1.25rem 1.5rem' }}>
                              <div style={{color: 'white', fontWeight: '500', fontSize: '0.9375rem'}}>{member[column]}</div>
                            </td>
                          )
                        })
                      }
                      
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border whitespace-nowrap ${getStatusStyle(displayStatus)}`} style={{letterSpacing: '-0.01em'}}>
                          {displayStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div> : null
      }
    </div>
  );
}