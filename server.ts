import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { optionalAuth, AuthRequest } from './src/middleware/auth.ts';
import {
  getComplexes,
  getComplexById,
  createComplex,
  updateComplex,
  deleteComplex,
  getBuildings,
  getBuildingById,
  createBuilding,
  updateBuilding,
  deleteBuilding,
  seedDemoEntities,
} from './src/db/queries.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ----------------------------------------------------
  // API Routes
  // ----------------------------------------------------
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      database: 'PostgreSQL (Cloud SQL)',
      timestamp: new Date().toISOString(),
    });
  });

  // COMPLEX CRUD ROUTES
  // GET /api/complexes - List all complexes
  app.get('/api/complexes', async (req, res) => {
    try {
      const complexes = await getComplexes();
      res.json({ success: true, data: complexes });
    } catch (error: any) {
      console.error('API Error [GET /api/complexes]:', error);
      res.status(500).json({ success: false, error: error.message || 'Failed to fetch complexes' });
    }
  });

  // GET /api/complexes/:id - Get single complex with its buildings
  app.get('/api/complexes/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, error: 'Invalid complex ID' });
      }
      const complex = await getComplexById(id);
      if (!complex) {
        return res.status(404).json({ success: false, error: 'Complex not found' });
      }
      res.json({ success: true, data: complex });
    } catch (error: any) {
      console.error(`API Error [GET /api/complexes/${req.params.id}]:`, error);
      res.status(500).json({ success: false, error: error.message || 'Failed to fetch complex' });
    }
  });

  // POST /api/complexes - Create new complex
  app.post('/api/complexes', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const ComplexName = req.body.ComplexName || req.body.complexName;
      const Address = req.body.Address || req.body.address;
      if (!ComplexName || !ComplexName.trim()) {
        return res.status(400).json({ success: false, error: 'ComplexName is required' });
      }
      if (!Address || !Address.trim()) {
        return res.status(400).json({ success: false, error: 'Address is required' });
      }

      const ChangeUserID = req.userIdString || req.body.ChangeUserID || req.body.changeUserId || 'anonymous';
      const newComplex = await createComplex({
        ComplexName,
        Address,
        ChangeUserID,
      });

      res.status(201).json({ success: true, data: newComplex });
    } catch (error: any) {
      console.error('API Error [POST /api/complexes]:', error);
      res.status(500).json({ success: false, error: error.message || 'Failed to create complex' });
    }
  });

  // PUT /api/complexes/:id - Update existing complex
  app.put('/api/complexes/:id', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, error: 'Invalid complex ID' });
      }

      const ComplexName = req.body.ComplexName !== undefined ? req.body.ComplexName : req.body.complexName;
      const Address = req.body.Address !== undefined ? req.body.Address : req.body.address;
      const ChangeUserID = req.userIdString || req.body.ChangeUserID || req.body.changeUserId || 'anonymous';

      const updated = await updateComplex(id, {
        ComplexName,
        Address,
        ChangeUserID,
      });

      if (!updated) {
        return res.status(404).json({ success: false, error: 'Complex not found' });
      }

      res.json({ success: true, data: updated });
    } catch (error: any) {
      console.error(`API Error [PUT /api/complexes/${req.params.id}]:`, error);
      res.status(500).json({ success: false, error: error.message || 'Failed to update complex' });
    }
  });

  // DELETE /api/complexes/:id - Delete complex (cascade deletes its buildings)
  app.delete('/api/complexes/:id', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, error: 'Invalid complex ID' });
      }

      const deleted = await deleteComplex(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Complex not found' });
      }

      res.json({ success: true, data: deleted, message: 'Complex and its buildings deleted successfully' });
    } catch (error: any) {
      console.error(`API Error [DELETE /api/complexes/${req.params.id}]:`, error);
      res.status(500).json({ success: false, error: error.message || 'Failed to delete complex' });
    }
  });

  // BUILDING CRUD ROUTES
  // GET /api/buildings - List all buildings, optionally filtered by ComplexID
  app.get('/api/buildings', async (req, res) => {
    try {
      const complexIdParam = req.query.ComplexID || req.query.complexId;
      const complexIdQuery = complexIdParam ? parseInt(complexIdParam as string, 10) : undefined;
      const buildingsList = await getBuildings(complexIdQuery);
      res.json({ success: true, data: buildingsList });
    } catch (error: any) {
      console.error('API Error [GET /api/buildings]:', error);
      res.status(500).json({ success: false, error: error.message || 'Failed to fetch buildings' });
    }
  });

  // GET /api/buildings/:id - Get single building
  app.get('/api/buildings/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, error: 'Invalid building ID' });
      }
      const building = await getBuildingById(id);
      if (!building) {
        return res.status(404).json({ success: false, error: 'Building not found' });
      }
      res.json({ success: true, data: building });
    } catch (error: any) {
      console.error(`API Error [GET /api/buildings/${req.params.id}]:`, error);
      res.status(500).json({ success: false, error: error.message || 'Failed to fetch building' });
    }
  });

  // POST /api/buildings - Create new building
  app.post('/api/buildings', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const rawComplexId = req.body.ComplexID ?? req.body.complexId;
      const BuildingName = req.body.BuildingName || req.body.buildingName;

      if (!rawComplexId) {
        return res.status(400).json({ success: false, error: 'ComplexID is required' });
      }
      if (!BuildingName || !BuildingName.trim()) {
        return res.status(400).json({ success: false, error: 'BuildingName is required' });
      }

      const parsedComplexId = parseInt(rawComplexId, 10);
      if (isNaN(parsedComplexId)) {
        return res.status(400).json({ success: false, error: 'Valid numeric ComplexID is required' });
      }

      const ChangeUserID = req.userIdString || req.body.ChangeUserID || req.body.changeUserId || 'anonymous';
      const newBuilding = await createBuilding({
        ComplexID: parsedComplexId,
        BuildingName,
        ChangeUserID,
      });

      res.status(201).json({ success: true, data: newBuilding });
    } catch (error: any) {
      console.error('API Error [POST /api/buildings]:', error);
      res.status(500).json({ success: false, error: error.message || 'Failed to create building' });
    }
  });

  // PUT /api/buildings/:id - Update existing building
  app.put('/api/buildings/:id', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, error: 'Invalid building ID' });
      }

      const rawComplexId = req.body.ComplexID ?? req.body.complexId;
      const BuildingName = req.body.BuildingName !== undefined ? req.body.BuildingName : req.body.buildingName;
      const ChangeUserID = req.userIdString || req.body.ChangeUserID || req.body.changeUserId || 'anonymous';

      const updateData: { ComplexID?: number; BuildingName?: string; ChangeUserID?: string } = {
        ChangeUserID,
      };
      if (rawComplexId !== undefined) {
        const parsedComplexId = parseInt(rawComplexId, 10);
        if (isNaN(parsedComplexId)) {
          return res.status(400).json({ success: false, error: 'Valid numeric ComplexID is required' });
        }
        updateData.ComplexID = parsedComplexId;
      }
      if (BuildingName !== undefined) {
        updateData.BuildingName = BuildingName;
      }

      const updated = await updateBuilding(id, updateData);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Building not found' });
      }

      res.json({ success: true, data: updated });
    } catch (error: any) {
      console.error(`API Error [PUT /api/buildings/${req.params.id}]:`, error);
      res.status(500).json({ success: false, error: error.message || 'Failed to update building' });
    }
  });

  // DELETE /api/buildings/:id - Delete building
  app.delete('/api/buildings/:id', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, error: 'Invalid building ID' });
      }

      const deleted = await deleteBuilding(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Building not found' });
      }

      res.json({ success: true, data: deleted, message: 'Building deleted successfully' });
    } catch (error: any) {
      console.error(`API Error [DELETE /api/buildings/${req.params.id}]:`, error);
      res.status(500).json({ success: false, error: error.message || 'Failed to delete building' });
    }
  });

  // POST /api/seed - Seed demo data
  app.post('/api/seed', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const changeUserId = req.userIdString || 'admin_user';
      const result = await seedDemoEntities(changeUserId);
      res.json({ success: true, ...result });
    } catch (error: any) {
      console.error('API Error [POST /api/seed]:', error);
      res.status(500).json({ success: false, error: error.message || 'Failed to seed demo entities' });
    }
  });

  // Vite middleware for development / Static file serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
