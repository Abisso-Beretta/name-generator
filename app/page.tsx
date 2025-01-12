'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export default function NameGenerator() {
  // 默认字库
  const defaultSurnames = [
    // 单字姓
    '李', '王', '张', '刘', '陈', '杨', '黄', '赵', '周', '吴',
    '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗',
    // 复姓
    '欧阳', '司马', '诸葛', '独孤', '皇甫', '东方', '南宫', '慕容', '夏侯', '宇文',
    '轩辕', '令狐', '上官', '司徒', '司空', '西门', '百里', '公孙', '仲孙', '长孙'
  ];

  const defaultMaleNames = [
    '伟', '强', '磊', '军', '洋', '勇', '杰', '涛', '明', '超',
    '刚', '立', '志', '建', '东', '晨', '睿', '天', '宇', '浩',
    '博', '文', '云', '力', '思', '振', '华', '飞', '英', '雄'
  ];

  const defaultFemaleNames = [
    '芳', '娜', '敏', '静', '丽', '艳', '娟', '霞', '秀', '莉',
    '琳', '晶', '华', '倩', '云', '芙', '玉', '萍', '红', '月',
    '琪', '瑶', '璐', '妍', '彤', '莹', '雅', '馨', '梦', '星'
  ];

  // 状态管理
  const [currentName, setCurrentName] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [isMale, setIsMale] = useState(true);
  const [customSurname, setCustomSurname] = useState('');
  const [useCustomSurname, setUseCustomSurname] = useState(false);
  const [nameLength, setNameLength] = useState('random');
  const [customNameLength, setCustomNameLength] = useState(2);
  
  // 字库状态
  const [surnames, setSurnames] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('surnames');
      return saved ? JSON.parse(saved) : defaultSurnames;
    }
    return defaultSurnames;
  });
  
  const [maleNames, setMaleNames] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('maleNames');
      return saved ? JSON.parse(saved) : defaultMaleNames;
    }
    return defaultMaleNames;
  });
  
  const [femaleNames, setFemaleNames] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('femaleNames');
      return saved ? JSON.parse(saved) : defaultFemaleNames;
    }
    return defaultFemaleNames;
  });

  // 编辑状态
  const [editSurnames, setEditSurnames] = useState('');
  const [editMaleNames, setEditMaleNames] = useState('');
  const [editFemaleNames, setEditFemaleNames] = useState('');

  // 保存字库到 localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('surnames', JSON.stringify(surnames));
      localStorage.setItem('maleNames', JSON.stringify(maleNames));
      localStorage.setItem('femaleNames', JSON.stringify(femaleNames));
    }
  }, [surnames, maleNames, femaleNames]);

  // 打开编辑对话框时初始化编辑内容
  const initializeEdit = () => {
    setEditSurnames(surnames.join(' '));
    setEditMaleNames(maleNames.join(' '));
    setEditFemaleNames(femaleNames.join(' '));
  };

  // 保存编辑的字库
  const saveCharacterSets = () => {
    setSurnames(editSurnames.trim().split(/\s+/));
    setMaleNames(editMaleNames.trim().split(/\s+/));
    setFemaleNames(editFemaleNames.trim().split(/\s+/));
  };

  // 生成随机姓名
  const generateName = () => {
    // 获取姓氏
    const surname = useCustomSurname ? customSurname : surnames[Math.floor(Math.random() * surnames.length)];
    
    // 确定名字长度
    const finalNameLength = nameLength === 'random' ? (Math.random() < 0.5 ? 1 : 2) : customNameLength;
    
    // 选择名字字库
    const namePool = isMale ? maleNames : femaleNames;
    let givenName = '';
    
    // 临时数组，用于跟踪已使用的字
    const usedChars = [];
    
    // 生成指定长度的名字
    while (givenName.length < finalNameLength) {
      const randomIndex = Math.floor(Math.random() * namePool.length);
      const newChar = namePool[randomIndex];
      
      // 确保不重复使用同一个字
      if (!usedChars.includes(newChar)) {
        givenName += newChar;
        usedChars.push(newChar);
      }
    }
    
    const newName = surname + givenName;
    setCurrentName(newName);
    setHistory(prev => [newName, ...prev].slice(0, 10));
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">随机姓名生成器</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center gap-2">
                  <Label>性别：</Label>
                  <span>{isMale ? '男' : '女'}</span>
                </div>
                <Switch
                  checked={isMale}
                  onCheckedChange={setIsMale}
                />
              </div>
              
              <Dialog onOpenChange={(open) => open && initializeEdit()}>
                <DialogTrigger asChild>
                  <Button variant="outline">编辑字库</Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>编辑字库</DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue="surnames" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="surnames">姓氏库</TabsTrigger>
                      <TabsTrigger value="male">男性名字库</TabsTrigger>
                      <TabsTrigger value="female">女性名字库</TabsTrigger>
                    </TabsList>
                    <TabsContent value="surnames">
                      <div className="space-y-2">
                        <Label>编辑姓氏（用空格分隔）：</Label>
                        <Textarea
                          value={editSurnames}
                          onChange={(e) => setEditSurnames(e.target.value)}
                          rows={6}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="male">
                      <div className="space-y-2">
                        <Label>编辑男性名字（用空格分隔）：</Label>
                        <Textarea
                          value={editMaleNames}
                          onChange={(e) => setEditMaleNames(e.target.value)}
                          rows={6}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="female">
                      <div className="space-y-2">
                        <Label>编辑女性名字（用空格分隔）：</Label>
                        <Textarea
                          value={editFemaleNames}
                          onChange={(e) => setEditFemaleNames(e.target.value)}
                          rows={6}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                  <div className="flex justify-end mt-4">
                    <Button onClick={saveCharacterSets}>
                      保存修改
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* 姓氏选择部分 */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label>使用自定义姓氏：</Label>
                <Switch
                  checked={useCustomSurname}
                  onCheckedChange={setUseCustomSurname}
                />
              </div>
              {useCustomSurname && (
                <div className="flex-1">
                  <Input
                    value={customSurname}
                    onChange={(e) => setCustomSurname(e.target.value)}
                    placeholder="输入姓氏"
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* 名字长度选择部分 */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label>指定名字字数：</Label>
                <div className="flex gap-2 border rounded-lg p-1 bg-gray-50">
                  <Button
                    size="sm"
                    onClick={() => setCustomNameLength(1)}
                    className={cn(
                      "min-w-20",
                      customNameLength === 1
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-white hover:bg-gray-100"
                    )}
                  >
                    单字
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setCustomNameLength(2)}
                    className={cn(
                      "min-w-20",
                      customNameLength === 2
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-white hover:bg-gray-100"
                    )}
                  >
                    双字
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="text-3xl font-bold mb-4">
              {currentName || '点击下方按钮生成姓名'}
            </div>
            <Button 
              onClick={generateName}
              className="w-full"
              disabled={useCustomSurname && !customSurname}
            >
              生成新名字
            </Button>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">历史记录</h3>
            <div className="space-y-2">
              {history.map((name, index) => (
                <div 
                  key={index} 
                  className="p-2 bg-gray-100 rounded"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}