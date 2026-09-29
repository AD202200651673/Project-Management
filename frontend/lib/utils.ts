export const dataGridClassNames =
  "w-full border border-gray-200/80 bg-white rounded-2xl shadow-sm dark:border-stroke-dark dark:bg-dark-secondary overflow-hidden";

export const dataGridSxStyles = (isDarkMode: boolean) => {
  return {
    width: "100%",
    border: "none",
    backgroundColor: isDarkMode ? "#1d1f21" : "#ffffff",
    color: isDarkMode ? "#e5e7eb" : "#1f2937",
    fontFamily: "inherit",
    "& .MuiDataGrid-main": {
      width: "100%",
      backgroundColor: isDarkMode ? "#1d1f21" : "#ffffff",
      color: isDarkMode ? "#e5e7eb" : "#1f2937",
    },
    "& .MuiDataGrid-topContainer": {
      width: "100%",
      backgroundColor: isDarkMode ? "#181a1c" : "#f8fafc",
    },
    "& .MuiDataGrid-columnHeaders": {
      width: "100%",
      backgroundColor: isDarkMode ? "#181a1c" : "#f8fafc",
      color: isDarkMode ? "#94a3b8" : "#475569",
      borderBottom: `1px solid ${isDarkMode ? "#2d3135" : "#e2e8f0"}`,
      fontSize: "0.75rem",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      minHeight: "48px !important",
      maxHeight: "48px !important",
      lineHeight: "48px !important",
    },
    "& .MuiDataGrid-columnHeader": {
      backgroundColor: isDarkMode ? "#181a1c" : "#f8fafc",
      "&:focus": { outline: "none !important" },
      "&:focus-within": { outline: "none !important" },
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: 700,
      color: isDarkMode ? "#cbd5e1" : "#475569",
    },
    "& .MuiDataGrid-filler": {
      backgroundColor: isDarkMode ? "#181a1c" : "#f8fafc",
    },
    "& .MuiDataGrid-scrollbarFiller": {
      backgroundColor: isDarkMode ? "#181a1c" : "#f8fafc",
      minWidth: 0,
    },
    "& .MuiDataGrid-cell": {
      color: isDarkMode ? "#e2e8f0" : "#334155",
      borderBottom: `1px solid ${isDarkMode ? "#26292d" : "#f1f5f9"}`,
      fontSize: "0.8125rem",
      display: "flex",
      alignItems: "center",
      padding: "0 1rem",
      "&:focus": { outline: "none !important" },
      "&:focus-within": { outline: "none !important" },
    },
    "& .MuiDataGrid-row": {
      transition: "background-color 0.15s ease",
      backgroundColor: isDarkMode ? "#1d1f21" : "#ffffff",
      minHeight: "52px !important",
      maxHeight: "52px !important",
      "&:hover": {
        backgroundColor: isDarkMode ? "#26292d !important" : "#f8fafc !important",
        cursor: "pointer",
      },
      "&.Mui-selected": {
        backgroundColor: isDarkMode ? "#2e3238 !important" : "#f1f5f9 !important",
        "&:hover": {
          backgroundColor: isDarkMode ? "#353940 !important" : "#e2e8f0 !important",
        },
      },
    },
    "& .MuiDataGrid-footerContainer": {
      width: "100%",
      backgroundColor: isDarkMode ? "#181a1c" : "#f8fafc",
      color: isDarkMode ? "#94a3b8" : "#64748b",
      borderTop: `1px solid ${isDarkMode ? "#2d3135" : "#e2e8f0"}`,
      fontSize: "0.8125rem",
      minHeight: "54px",
    },
    "& .MuiTablePagination-root": {
      color: isDarkMode ? "#94a3b8" : "#64748b",
      fontSize: "0.8125rem",
      width: "100%",
    },
    "& .MuiTablePagination-toolbar": {
      minHeight: "54px",
      padding: "0 1.25rem",
      gap: "0.75rem",
    },
    "& .MuiTablePagination-spacer": {
      flex: "1 1 100%",
    },
    "& .MuiTablePagination-selectLabel": {
      fontSize: "0.8125rem",
      fontWeight: 500,
      color: isDarkMode ? "#94a3b8" : "#64748b",
      margin: 0,
    },
    "& .MuiTablePagination-displayedRows": {
      fontSize: "0.8125rem",
      fontWeight: 600,
      color: isDarkMode ? "#cbd5e1" : "#334155",
      margin: 0,
    },
    "& .MuiTablePagination-input": {
      marginRight: "1rem",
      marginLeft: "0.5rem",
    },
    "& .MuiTablePagination-select": {
      fontSize: "0.8125rem",
      fontWeight: 600,
      color: isDarkMode ? "#e2e8f0" : "#1f2937",
      paddingRight: "1.75rem !important",
      paddingLeft: "0.625rem !important",
      paddingTop: "0.25rem !important",
      paddingBottom: "0.25rem !important",
      borderRadius: "0.5rem",
      backgroundColor: isDarkMode ? "#26292d" : "#ffffff",
      border: `1px solid ${isDarkMode ? "#3b3e42" : "#e2e8f0"}`,
    },
    "& .MuiTablePagination-selectIcon": {
      color: isDarkMode ? "#94a3b8" : "#64748b",
    },
    "& .MuiTablePagination-actions": {
      marginLeft: "0.75rem",
      display: "flex",
      alignItems: "center",
      gap: "0.375rem",
      "& button": {
        color: isDarkMode ? "#cbd5e1" : "#475569",
        padding: "0.375rem",
        borderRadius: "0.5rem",
        border: `1px solid ${isDarkMode ? "#3b3e42" : "#e2e8f0"}`,
        backgroundColor: isDarkMode ? "#26292d" : "#ffffff",
        transition: "all 0.15s ease",
        "&:hover": {
          backgroundColor: isDarkMode ? "#353940" : "#f1f5f9",
          color: isDarkMode ? "#ffffff" : "#0f172a",
          borderColor: isDarkMode ? "#4b5563" : "#cbd5e1",
        },
        "&.Mui-disabled": {
          color: isDarkMode ? "#4b5563" : "#cbd5e1",
          opacity: 0.4,
          borderColor: isDarkMode ? "#2d3135" : "#f1f5f9",
          backgroundColor: "transparent",
        },
      },
    },
    "& .MuiDataGrid-columnSeparator": {
      display: "none",
    },
    "& .MuiDataGrid-menuIcon": {
      display: "none !important",
    },
    "& .MuiDataGrid-menuIconButton": {
      display: "none !important",
    },
    "& .MuiDataGrid-sortIcon": {
      display: "none !important",
    },
    "& .MuiDataGrid-iconButtonContainer": {
      display: "none !important",
    },
    "& .MuiDataGrid-virtualScroller": {
      backgroundColor: isDarkMode ? "#1d1f21" : "#ffffff",
    },
  };
};