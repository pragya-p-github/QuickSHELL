import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { VscSettings } from "react-icons/vsc";
import { VscArrowDown } from "react-icons/vsc";
import { VscCircleLargeFilled } from "react-icons/vsc";
import {VscAccount} from 'react-icons/vsc';
import {VscAdd, VscEllipsis} from 'react-icons/vsc'
import './TaskCard.css';


const API_URL = 'https://api.quicksell.co/v1/internal/frontend-assignment';

function KanbanBoard() {
  const [tickets, setTickets] = useState([]);
  const [groupingOption, setGroupingOption] = useState('status');
  const [sortingOption, setSortingOption] = useState('priority');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 


  useEffect(() => {
    axios.get(API_URL)
      .then((response) => {
        setTickets(response.data.tickets);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);


  const handleOptionChange = (e) => {
    const optionValue = e.target.value;
    const optionType = e.target.getAttribute('data-option-type');

    if (optionType === 'grouping') {
      setGroupingOption(optionValue);
    } else if (optionType === 'ordering') {
      setSortingOption(optionValue);
    }
  };

  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };


  const groupTickets = () => {
    switch (groupingOption) {
      case 'userId':
        return groupByUserId();
      case 'status':
        return groupByStatus();
      case 'priority':
        return groupByPriority();
      default:
        return [];
    }
  };

  const sortTickets = (groupedTickets) => {
    switch (sortingOption) {
      case 'priority':
        return sortTicketsByPriority(groupedTickets);
      case 'title':
        return sortTicketsByTitle(groupedTickets);
      default:
        return groupedTickets;
    }
  };

  const groupByUserId = () => {
    const grouped = {};
    tickets.forEach((ticket) => {
      const userId = ticket.userId;
      if (!grouped[userId]) {
        grouped[userId] = [];
      }
      grouped[userId].push(ticket);
    });
    return grouped;
  };

  const groupByStatus = () => {
    const grouped = {};
    tickets.forEach((ticket) => {
      const status = ticket.status;
      if (!grouped[status]) {
        grouped[status] = [];
      }
      grouped[status].push(ticket);
    });
    return grouped;
  };
  const priorityNames = {
    0: 'No Priority',
    1: 'Low',
    2: 'Medium',
    3: 'High',
    4: 'Urgent',
  };

  const groupByPriority = () => {
    const grouped = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
    };

    tickets.forEach((ticket) => {
      const priority = ticket.priority;
      grouped[priority].push(ticket);
    });
    return grouped;
  };


  const sortTicketsByPriority = (groupedTickets) => {
    for (const key in groupedTickets) {
      groupedTickets[key].sort((a, b) => b.priority - a.priority);
    }
    return groupedTickets;
  };

  const sortTicketsByTitle = (groupedTickets) => {
    for (const key in groupedTickets) {
      groupedTickets[key].sort((a, b) => a.title.localeCompare(b.title));
    }
    return groupedTickets;
  };

  return (
    <div className="kanban-board">
      <div className="controls">
        <div className="dropdown">
          <button className='dropdown-btn' onClick={toggleDropdown} onBlur={closeDropdown}><VscSettings className='VscSettings' />Display <VscArrowDown></VscArrowDown></button>
          <div className='dropdown-content'>
            <div className="sub-dropdown">
              <div className='sub-drop'>Grouping</div>
              <select className="sub-dropdown-content"
                value={groupingOption}
                onChange={handleOptionChange}
                data-option-type="grouping"
              >
                <option value="userId">User</option>
                <option value="status">Status</option>
                <option value="priority">Priority</option>
              </select>
            </div>
            <div className="sub-dropdown">
              <div className='sub-drop'>Ordering</div>
              <select className="sub-dropdown-content"
                value={sortingOption}
                onChange={handleOptionChange}
                data-option-type="ordering"
              >
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      <div className="columns">
        {Object.keys(groupTickets()).map((groupKey) => (
          <div className="column" key={groupKey}>
            <div className="column-header">
              {groupingOption === 'status' && <div className="status">{groupKey} 
              <VscAdd className='addicon'></VscAdd>
              <VscEllipsis></VscEllipsis>
              </div>}
              {groupingOption === 'userId' && <div className="user">{groupKey}</div>}
              {groupingOption === 'priority' && <div className="priority">{priorityNames[groupKey]}</div>}
            </div>

            {groupTickets()[groupKey].map((ticket) => (
              <div className="task-card" key={ticket.id}>
                <div className="task-id">{ticket.id}</div>
                <div className="task-title">{ticket.title}</div>
                <VscAccount className='accounticon'></VscAccount>
                <div className='container'>
                  <button className='task-opt'> ! </button>
                  <button className="task-tag">
                    <VscCircleLargeFilled /> {ticket.tag}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

    </div>
  );
}

export default KanbanBoard;