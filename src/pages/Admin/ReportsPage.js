import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './BookingsPage.css'; 

function ReportsPage() {
  const { user } = useAuth();
  
  const [financials, setFinancials] = useState([]);
  const [topClients, setTopClients] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [occupancy, setOccupancy] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const [finData, clientData, catData, occData] = await Promise.all([
          api.getFinancialReport(),
          api.getTopClientsReport(),
          api.getCategoryPopularityReport(),
          api.getOccupancyReport()
        ]);
        
        setFinancials(finData.monthly_revenue);
        setTopClients(clientData.top_clients);
        setCategoryStats(catData.popularity);
        setOccupancy(occData.occupancy);

      } catch (err) {
        setError('Failed to load reports.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/profile" replace />;
  }

  if (isLoading) {
    return <div className="admin-page-container"><h1>Loading Reports...</h1></div>;
  }
  if (error) {
    return <div className="admin-page-container"><h1>{error}</h1></div>;
  }

  return (
    <div className="admin-page-container">
      <h1>Admin Reports</h1>
      <div className="admin-form" style={{maxWidth: '100%'}}>
        <h2>Current Room Occupancy (Today)</h2>
        <div className="occupancy-grid">
          {occupancy.map(room => (
            <div key={room.room_id} className={`occupancy-card ${room.status}`}>
              <h3>{room.room_number}</h3>
              <span className="category">{room.category}</span>
              
              {room.status === 'occupied' ? (
                <>
                  <span className="status-badge busy">Occupied</span>
                  <div className="guest-info">
                    <p><strong>Guest:</strong> {room.guest_name}</p>
                    <p><strong>Out:</strong> {room.check_out}</p>
                  </div>
                </>
              ) : (
                <span className="status-badge free">Available</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="admin-form">
        <h2>Room Category Popularity</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Total Bookings</th>
            </tr>
          </thead>
          <tbody>
            {categoryStats.map((item, index) => (
              <tr key={index}>
                <td>{item.category}</td>
                <td>{item.count} bookings</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-form">
        <h2>Financials (Revenue per Month)</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Total Revenue (UAH)</th>
            </tr>
          </thead>
          <tbody>
            {financials.map(item => (
              <tr key={item.month}>
                <td>{item.month}</td>
                <td>{item.revenue.toFixed(2)} UAH</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-form">
        <h2>Top 5 Clients</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Spent (UAH)</th>
            </tr>
          </thead>
          <tbody>
            {topClients.map(client => (
              <tr key={client.user_id}>
                <td>{client.username}</td>
                <td>{client.email}</td>
                <td>{client.total_spent.toFixed(2)} UAH</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportsPage;