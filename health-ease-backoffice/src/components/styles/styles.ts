import { Box, styled } from "@mui/material";
import Grid from "@mui/material/Grid2";

const CustomBox = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
`;

const GridWrapper = styled(Grid)`
    max-width: 1000px;
`;

const CustomGrid = styled(Grid)`
    display: flex;
    flex-direction: column;
    height: auto;
    padding: 8px;

    @media (max-width: 600px) {
        width: 100%;
    }

    @media (min-width: 600px) and (max-width: 960px) {
        width: 50%;
    }

    @media (min-width: 960px) and (max-width: 1280px) {
        width: 33.33%;
    }

    @media (min-width: 1280px) {
        width: 25%;
    }
`;

export { GridWrapper, CustomGrid, CustomBox };
