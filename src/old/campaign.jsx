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
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sheetId, setSheetId] = useState('');
  const [didId, setDidId] = useState('');
  const [scriptId, setScriptId] = useState('');
  // const [members, setMembers] = useState([]);
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const highlightedRowRef = useRef(null);
  const navigate = useNavigate()
  const location = useLocation();

  useEffect(() => {
    if (isStarted && highlightedRowRef.current) {
      highlightedRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isStarted]);

  // useEffect(() => {
  //   const attachHandler = () => {
  //     if (window.socket) {
  //       window.socket.onmessage = (message) => {
  //         message = JSON.parse(message.data);
  //         updateCallStatus(message.sheet_index, message.status);
  //       }
  //     }
  //   }

  //   attachHandler();
  // }, [sheet]);

  useEffect(() => {
    const getResources = async () => {
      const response = await fetch('https://localhost:8080/resources', { credentials: 'include' });
     
      if (response.status == 401) {
        return navigate('/login')
      }
      
      // (response.ok) ? setSheetTitles(await response.json()) : setSheetTitles([]);
      if (response.ok) {
        const { resources, ongoing_campaign } = await response.json();
        const fallback = [];

        setSheetTitles(resources[0] || fallback);
        setNumbers(resources[1] || fallback);
        setScriptTitles(resources[2] || fallback);

        if (ongoing_campaign) {
          const sheet_id = ongoing_campaign[0];
          const call_status_report = ongoing_campaign[1];

          if (window.socket?.readyState !== 1) {
            window.socket = new WebSocket('wss://localhost:8080');

            window.socket.onopen = () => {
              console.log('Welcome back, you\'re connected.');
            }

            // window.socket.onerror = (err) => console.log(err);
          }
          
          fetchSheet(sheet_id, call_status_report)
          .then(result => {
            if (!result) return

            window.socket.onmessage = (message) => {
              message = JSON.parse(message.data);
              updateCallStatus(message.sheet_index, message.status);
            }

            setIsStarted(true);
            setIsPaused(false);
            setIsPaused(true);
          })
        }
      }
    }

    getResources()
  }, []);

  async function fetchSheet(id, call_status_report) {
    const response = await fetch(`https://localhost:8080/sheets/${id}`, { credentials: 'include' });

    if (response.status == 401) {
      return navigate('/login')
    }

    const sheet = await response.json();
    if (response.ok) {
      setSheet(sheet);
      setColumns(Object.keys(sheet[0]));

      if (call_status_report?.length) {
        setSheet(prev => prev.map(row => {
          let status = '';

          if (!checkNumberValidity(row['Telephone']) && call_status_report.length) {
            status = 'failed'
          }
          else if (call_status_report.length) {
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
    console.log({sheet})
    if (['no answer', 'ended'].includes(status)) setIndex(+index + 1);
    
    setSheet(prev => prev.map((row, i) => {
      console.log(row)

      if (status == 'ended') status = row.status;
  
      if (i == index) {
        if (!checkNumberValidity(row['Telephone'])) status = 'failed';

        return {...row, status}
      }
      else {
        return row
      }
    })
    )
  }

  const isFormValid = leadSheet !== '' && leadSheet !== 'Select Lead Sheet' &&
                       callerId !== '' && callerId !== 'Select Caller Id' && 
                       attendant !== '' && attendant !== 'Select Attendant' && 
                       index !== '' && index >= 0 && index <= sheet.length - 1;

  const handleStart = async () => {
    if (!isFormValid) return

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
          // if (!response.ok) return window.socket.close()
          if (!response.ok) return
          
          setIsStarted(true);
          setIsPaused(false);
        });
      }
  
      // window.socket.onmessage = (message) => {
      //   message = JSON.parse(message.data);
      //   updateCallStatus(message.sheet_index, message.status);
      // }
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

  // const handleStop = () => {
  //   setIsStarted(false);
  //   setIsPaused(false);


  //   setSheet([]);
  //   setIndex('');
  //   setCallerId('');
  //   setLeadSheet('');
  //   setAttendant('');
  // };

  const handleStopClick = () => {
    setShowStopConfirm(true);
  };

  const confirmStop = () => {
    setIsStarted(false);
    setIsPaused(false);

    setSheet([]);
    setIndex('');
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
        return 'bg-green-900/30 text-green-400 border-green-700';
      case 'no answer':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-700';
      case 'busy':
        return 'bg-orange-900/30 text-orange-400 border-orange-700';
      case 'queued':
        return 'bg-blue-900/30 text-blue-400 border-blue-700';
      case 'ringing':
        return 'bg-purple-900/30 text-purple-400 border-purple-700';
      case 'failed':
        return 'bg-red-900/30 text-red-400 border-red-700';
      default:
        // return 'bg-green-900/30 text-green-400 border-green-700';
        return 'invisible'
    }
  };

  function checkNumberValidity(tel) {
    if (!tel) return false
    
    tel = tel.toString();
    if (/^\+1\d{10}$/.test(tel)) return true;

    tel = tel.replaceAll(/\D/g, '');
    tel = (tel[0] == 1) ? tel : '1' + tel
    
    if (tel.length === 11) {
      return true
    }
    else {
      return false
    }
}

  const formatPhoneNumber = (value) => {
    const digitsOnly = value.replace(/\D/g, '');
    
    if (digitsOnly.length === 0) return '';
    if (digitsOnly.length <= 1) return `+${digitsOnly}`;
    if (digitsOnly.length <= 4) return `+${digitsOnly[0]} (${digitsOnly.slice(1)}`;
    if (digitsOnly.length <= 7) return `+${digitsOnly[0]} (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4)}`;
    return `+${digitsOnly[0]} (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7, 11)}`;
  };


  return (
    <div className="w-full p-4 md:p-8 flex flex-col relative" style={{ backgroundColor: 'rgb(38, 38, 36)', fontFamily: 'anthropicSans, "anthropicSans Fallback", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', height: '100vh' }}>
      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1.5); }
        }
      `}</style>

      {/* Stop Confirmation Dialog */}
      {showStopConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[rgb(31,30,29)] rounded-lg p-6 max-w-md w-full mx-4 border border-slate-700">
            <h3 className="text-white text-lg font-semibold mb-3">Stop Campaign?</h3>
            <p className="text-slate-300 text-sm mb-6">
              Are you sure you want to stop this campaign? All progress will be lost and you'll need to restart from the beginning.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelStop}
                className="px-4 py-2 rounded text-sm font-medium text-white bg-slate-700 hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmStop}
                className="px-4 py-2 rounded text-sm font-medium text-white transition-colors"
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
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end gap-4 w-full md:w-[70%] md:mx-auto">
          <div className="flex flex-col flex-1">
            <label className="text-white text-sm mb-2 font-bold mt-[60px] md:mt-0">Lead Sheet</label>
            <select 
              className="bg-transparent text-white px-3 py-1 rounded border border-slate-600 focus:outline-none focus:border-slate-500 cursor-pointer text-sm" 
              style={{ colorScheme: 'dark' }}
              value={leadSheet}
              onChange={(e) => {
                setLeadSheet(e.target.value);
                const [option] = e.target.selectedOptions;
                const sheet_id = option.id?.replaceAll(/\D/g, '');
                setSheetId(sheet_id);
                fetchSheet(sheet_id)
              }}
            >
              <option style={{ backgroundColor: 'rgb(31, 30, 29)' }}>Select Lead Sheet</option>
              {sheetTitles.map((sheet) => {
                return (
                  <option style={{ backgroundColor: 'rgb(31, 30, 29)' }} id={`sheet-${sheet.id}`}>
                    {sheet.title}
                  </option>
                );
              })}
            </select>
          </div>
          
          <div className="flex flex-col flex-1">
            <label className="text-white text-sm mb-2 font-bold">Caller Id</label>
            <select 
              className="bg-transparent text-white px-3 py-1 rounded border border-slate-600 focus:outline-none focus:border-slate-500 cursor-pointer text-sm" 
              style={{ colorScheme: 'dark' }}
              value={callerId}
              onChange={(e) => {
                setCallerId(e.target.value);
                const [option] = e.target.selectedOptions;
                setDidId(option.id?.replaceAll(/\D/g, ''));
              }}
            >
              <option style={{ backgroundColor: 'rgb(31, 30, 29)' }}>Select Caller Id</option>
              {
                numbers.map((number) => {
                  return (
                    <option style={{ backgroundColor: 'rgb(31, 30, 29)' }} id={`number-${number.id}`}>{formatPhoneNumber(number.phone_number)}</option>
                  );
                })
              }
            </select>
          </div>
          
          <div className="flex flex-col flex-1">
            <label className="text-white text-sm mb-2 font-bold">Automated Attendant</label>
            <select 
              className="bg-transparent text-white px-3 py-1 rounded border border-slate-600 focus:outline-none focus:border-slate-500 cursor-pointer text-sm" 
              style={{ colorScheme: 'dark' }}
              value={attendant}
              onChange={(e) => {
                setAttendant(e.target.value);
                const [option] = e.target.selectedOptions;
                setScriptId(option.id?.replaceAll(/\D/g, ''));
              }}
            >
              <option style={{ backgroundColor: 'rgb(31, 30, 29)' }}>Select Attendant</option>
              {
                scriptTitles.map((title) => {
                  return (
                    <option style={{ backgroundColor: 'rgb(31, 30, 29)' }} id={`script-${title.id}`}>{title.title}</option>
                  );
                })
              }
            </select>
          </div>
          
          <div className="flex flex-col flex-1">
            <label className="text-white text-sm mb-2 font-bold">Index</label>
            <input 
              type="number" 
              className="bg-transparent text-white px-3 py-1 rounded border border-slate-600 focus:outline-none focus:border-slate-500 cursor-pointer text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={index}
              onChange={(e) => setIndex(e.target.value)}
            />
          </div>
          
          <button 
            className="px-6 py-1.5 rounded font-medium transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed" 
            style={{ backgroundColor: 'rgb(217, 119, 87)' }} 
            onMouseOver={(e) => !e.target.disabled && (e.target.style.opacity = '0.9')} 
            onMouseOut={(e) => !e.target.disabled && (e.target.style.opacity = '1')}
            disabled={!isFormValid}
            onClick={handleStart}
          >
            Start
          </button>
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
                    stroke="rgb(249, 115, 22)" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"/>
            </svg>
          </div>
          
          {/* Pause/Play Icon */}
          <button className="cursor-pointer hover:opacity-80 transition-opacity relative group" 
          onClick={() => {
            setIsPaused(!isPaused);
            fetch('https://localhost:8080/dialer/toggle', { credentials: 'include', method: 'POST'});
          }}
          >
            {isPaused ? (
              // Play Icon
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5v14l11-7L8 5z" fill="rgb(249, 115, 22)"/>
              </svg>
            ) : (
              // Pause Icon
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="4" width="4" height="16" rx="1" fill="rgb(249, 115, 22)"/>
                <rect x="14" y="4" width="4" height="16" rx="1" fill="rgb(249, 115, 22)"/>
              </svg>
            )}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {isPaused ? 'Resume campaign' : 'Pause campaign'}
            </span>
          </button>
          
          {/* Stop Icon */}
          <button className="cursor-pointer hover:opacity-80 transition-opacity relative group" onClick={handleStopClick}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="5" width="14" height="14" rx="2" fill="rgb(249, 115, 22)"/>
            </svg>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Stop campaign
            </span>
          </button>
        </div>
      )}

      {/* Table */}
      {
        sheet.length ? 
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="sticky top-0 z-10" style={{ backgroundColor: 'rgb(38, 38, 36)' }}>
              <tr className="border-b border-slate-700">
                <th className="py-4 px-4 md:px-6 text-left text-xs font-semibold text-white"></th>
                {
                  columns.map((column) => {
                    return (
                      <th className="py-4 px-4 md:px-6 text-left text-xs font-semibold text-white">{column}</th>
                    );
                  })
                }
                <th className="py-4 px-4 md:px-6 text-left text-xs font-semibold text-white">Call Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {sheet.map((member, idx) => {
                const isHighlighted = isStarted && idx >= parseInt(index) && idx < parseInt(index) + 3;
                let displayStatus = isHighlighted ? 'queued' : member.status;
                if (member.status) displayStatus = member.status;
                // if (!checkNumberValidity(member['Telephone'])) return(''); // EXCLUDE RECORDS WITH INVALID TELEPHONE NUMBER
                
                const isFirstHighlighted = isHighlighted && idx === parseInt(index);
    
                return (
                  <tr 
                    key={idx} 
                    ref={isFirstHighlighted ? highlightedRowRef : null}
                    className={`hover:bg-slate-800/50 transition-colors cursor-pointer ${isHighlighted ? 'bg-[rgb(31,30,29)]' : ''}`}
                  >
                    <td className="py-4 px-4 md:px-6">
                      <div className="text-slate-400 text-xs">{idx}</div>
                    </td>
                    {
                      columns.map((column) => {
                        return (
                          <td className="py-4 px-4 md:px-6">
                            <div className="text-white font-medium text-xs">{member[column]}</div>
                          </td>
                        )
                      })
                    }
                    
                    <td className="py-4 px-4 md:px-6">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-[9px] md:text-xs font-medium border whitespace-nowrap ${getStatusStyle(displayStatus)}`}>
                        {displayStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div> : null
      }
    </div>
  );
}