import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

//all this aggregate part is from the mongoose/mongodb API. It's not a function we made

export const getAnalyticsData = async () => {
  //this is just .length basically
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  //this is called "aggregation pipeline"
  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null, //this groups all documents together (what we receive from the db)
        totalSales: { $sum: 1 }, //the sum of everything is true
        totalRevenue: { $sum: "$totalAmount" }, //every order has this. Sums everything
      },
    },
  ]);
  //alocate what was aggregated, or return nothing (but structured) if undefined
  const { totalSales, totalRevenue } = salesData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };
  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
};

export const getDailySalesData = async (startDate, endDate) => {
  try {
    const dailySalesData = await Order.aggregate([
      {
        $match: {
          //this is a filter. takes what is Greater Than startDate, Lesser Than...
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        //then group everything in this format, summing these sales and revenue of above
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // example of dailySalesData. This is just of the "starting date"
    // you would receive seven objects like this, from start to end
    // [
    // 	{
    // 		_id: "2025-07-18",
    // 		sales: 12,
    // 		revenue: 1450.75
    // 	},
    // ]

    const dateArray = getDatesInRange(startDate, endDate);
    // console.log(dateArray) // ['2025-07-18', '2025-07-19', ... ]

    return dateArray.map((date) => {
      const foundData = dailySalesData.find((item) => item._id === date);

      return {
        date,
        sales: foundData?.sales || 0,
        revenue: foundData?.revenue || 0,
      };
    });
  } catch (error) {
    throw error;
  }
};

function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates; // gives this array: ['2025-07-18', '2025-07-19', ... ]
}
