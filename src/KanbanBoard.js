import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskCard.css'; // Importing CSS file


const API_URL = 'https://api.quicksell.co/v1/internal/frontend-assignment';

function KanbanBoard() {
  const [tickets, setTickets] = useState([]);
  const [groupingOption, setGroupingOption] = useState('status');
  const [sortingOption, setSortingOption] = useState('priority');

  useEffect(() => {
    axios.get(API_URL)
      .then((response) => {
        setTickets(response.data.tickets);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Function to handle changes in grouping and ordering options
  const handleOptionChange = (e) => {
    const optionValue = e.target.value;
    const optionType = e.target.getAttribute('data-option-type');

    if (optionType === 'grouping') {
      setGroupingOption(optionValue);
    } else if (optionType === 'ordering') {
      setSortingOption(optionValue);
    }
  };


// Grouping logic based on 'groupingOption'
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

// Group tickets by userId
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

// Group tickets by status
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

// Group tickets by priority
const groupByPriority = () => {
  const grouped = {
    0: [], // No priority
    1: [], // Low
    2: [], // Medium
    3: [], // High
    4: [], // Urgent
  };
  tickets.forEach((ticket) => {
    const priority = ticket.priority;
    grouped[priority].push(ticket);
  });
  return grouped;
};

// Sort tickets by priority within each group
// Sort tickets by priority within each group in descending order
const sortTicketsByPriority = (groupedTickets) => {
  for (const key in groupedTickets) {
    groupedTickets[key].sort((a, b) => b.priority - a.priority);
  }
  return groupedTickets;
};

// Sort tickets by title within each group
const sortTicketsByTitle = (groupedTickets) => {
  for (const key in groupedTickets) {
    groupedTickets[key].sort((a, b) => a.title.localeCompare(b.title));
  }
  return groupedTickets;
};


return (
  <div className="kanban-board">
    {/* Grouping and Sorting UI controls */}
    <div className="controls">
      <div className="control">
        <label htmlFor="groupingDropdown">Group by:</label>
        <select
          id="groupingDropdown"
          value={groupingOption}
          onChange={handleOptionChange}
          data-option-type="grouping"
        >
          <option value="userId">By User</option>
          <option value="status">By Status</option>
          <option value="priority">By Priority</option>
        </select>
      </div>
      <div className="control">
        <label htmlFor="orderingDropdown">Order by:</label>
        <select
          id="orderingDropdown"
          value={sortingOption}
          onChange={handleOptionChange}
          data-option-type="ordering"
        >
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>
    </div>

    <div className="columns">
  {Object.keys(groupTickets()).map((groupKey) => (
    <div className="column" key={groupKey}>
      <div className="column-header">
        {groupingOption === 'status' && <div className="status">{groupKey}</div>}
        {groupingOption === 'userId' && <div className="user">{groupKey}</div>}
        {groupingOption === 'priority' && <div className="priority">{groupKey}</div>}
      </div>

      {groupTickets()[groupKey].map((ticket) => (
        <div className="task-card" key={ticket.id}>
          <div className="task-id">{ticket.id}</div>
          <div className="task-title">{ticket.title}</div>
          <div className="task-tag">
            <span className="exclamation-mark">!</span>
            {ticket.tag}
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